const { Client } = require('discord.js');
require('discord-reply');
const client = new Client();
const mongoose = require('mongoose');
const wordsData = require('./Schemas/words.js');
const Database = require('./Schemas/config.js');
const puanData = require('./Schemas/point.js');
const fetch = require('node-fetch');
require('./functions.js')(client);

client.on('ready', async () => client.user.setPresence({ activity: { name: 'CCANSU', type: 'WATCHING' }, status: 'dnd' }).then(() => console.log(client.user.tag)));
client.login('ODU2OTk4MDg1NDE3NjMxNzg0.YNJLqQ.sqBkNWO9ltERCycH0k6TUqaw-e0').catch(e => console.log(e.message));
mongoose.connect('mongodb+srv://isaacunsteady:Asena6985@cluster0.ypikw.mongodb.net/wordsgame?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

client.colors = '#36393f';
let kanal = '855937936687235122';
let prefix = '.';

let green = '853012019280347146';
let red = '853012020017102899';

client.on("message", async (msg) => {
  if (msg.author.bot) return;
  const args = msg.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  let author = msg.guild.member(msg.author);
  if (command === 'başlat') {
    if (!author.permissions.has('ADMINISTRATOR')) return;
    Database.findOne({ guild: msg.guild.id }, async (err, res) => {
      if (res) {
        client.message(client.embed(`Kelime türetme oyunu zaten başlatılmış. Sona erdikten sonra tekrar deneyiniz.`, msg), msg.channel.id, 10000);
      } else {
        let random = String.fromCharCode(65+Math.floor(Math.random() * 26));
        let harf = random.charAt(random.length-1);
        new Database({ guild: msg.guild.id, user: null, word: null, letter: harf }).save();
        msg.channel.send(client.embed(`Kelime türetme oyunu başarıyla başlatıldı.\n\n**Oyunumuzun belirli kuralları vardır:**\n\`1.\` Yazılan kelimeler türkçe karakter içermelidir.\n\`2.\` Üst üste birden fazla kelime yazılmamalıdır.\n\`3.\` Oyun dışında mesaj iletmek için mesajın başına "." koymalısınız.\n\`3.\` Yazdığınız kelimeler türkçe olmak zorundadır.\n\`4.\` Belirtiğiniz kelimenin daha önceden yazılmamış olması gerekir.\n\`5.\` Belirtiğiniz kelimenin kaydedilmiş son harf ile başlaması gerekir.\n\nOyun **${harf}** harfi ile başlatılmış. Haftalık olarak puanlar sıfırlanacak ve birinci olan kişi ödüllendirilecektir.\n\nHerkese iyi oyunlar dileriz.`, msg));
      };
    });
  } else if (command === 'puan') {
    puanData.findOne({ guild: msg.guild.id, user: msg.author.id }, async (err, res) => {
      if (!res) {
        client.message(client.embed(`Henüz puanınız bulunmuyor.`, msg), msg.channel.id, 5000);
      } else {
        client.message(client.embed(`Toplam **${res.point}** puana sahipsin.`, msg), msg.channel.id, 10000);
      };
    });
  } else if (command === 'sıralama') {
    puanData.find({ guild: msg.guild.id }).sort([["point", "descending"]]).exec(async (err, res) => {
      let listed = res.filter((t) => ((t.point) !== 0) && (msg.guild.members.cache.get(t.user)));
      if (!listed.length) return client.message(client.embed(`Veritabanında veri bulunamadı.`, msg), msg.channel.id, 5000);
      let current = 1;
      let limit = 20;
      let pages = listed.chunk(limit);
      client.message(client.embed(`**Sunucumuzun en fazla puana sahip üyeleri listelenmiştir;**\n${pages[current - 1].map((kisi, index) => `\`${index +1}.\` ${msg.guild.members.cache.get(kisi.user).toString()} - toplam **${Number(kisi.point)}** puana sahip.`).join("\n")}`, msg), msg.channel.id, 10000);
    });
  } else;
});

client.on('message', async (msg) => {
  if (msg.author.bot || msg.channel.id !== kanal || msg.content.startsWith('.')) return;
  if (msg.content.split(" ").length > 1) return msg.react(red).then(client.message(client.embed(`Birden fazla kelime yazamazsın.`, msg), msg.channel.id, 5000));
  Database.findOne({ guild: msg.guild.id }, async (err, res) => {
    if (!res) return msg.channel.send(client.embed(`Kelime türetme oyunu başlatılmamış.`, msg)).then(m => m.delete({ timeout: 5000 }), msg.delete());
    if (res) {
      let harf = res.letter;
      if (res.user === msg.author.id) return msg.react(red).then(client.message(client.embed(`Üst üste birden fazla kelime yazamazsın.`, msg), msg.channel.id, 5000));
      if (harf.toLowerCase() !== msg.content.charAt(0)) return msg.react(red).then(client.message(client.embed(`**${msg.content}** kelimesinde **${harf}** harfi bulunmuyor.`, msg), msg.channel.id, 5000));
      const api = await fetch(`https://sozluk.gov.tr/gts?ara=${encodeURI(msg.content)}`).then(a => a.json());
      if (api.error) return msg.react(red).then(client.message(client.embed(`**${msg.content}** kelimesi sözlükte bulunamadı.`, msg), msg.channel.id, 5000));
      wordsData.findOne({ guild: msg.guild.id }, async (err, data) => {
        if (!data) {
          new wordsData({ guild: msg.guild.id, words: msg.content }).save();
        } else {
          let words = data.words;
          if (words.includes(msg.content)) return msg.react(red).then(client.message(client.embed(`Belirtilen kelime daha önce kullanılmış.`, msg), msg.channel.id, 5000));
          data.words.push(msg.content);
          data.save();
          if (msg.content.charAt(msg.content.length-1) === 'ğ'.toLowerCase()) {
            let random = String.fromCharCode(65+Math.floor(Math.random() * 26));
            let yeniHarf = random.charAt(random.length-1);
            msg.react(green).then(client.message(client.embed(`Tebrikler, oyunu bitirdiniz. Fazladan ek olarak **5** puan kazandınız. Harf ${yeniHarf} olarak değiştirildi.`, msg), msg.channel.id, 5000));
            res.letter = yeniHarf;
            res.user = (msg.author.id);
            res.word = (msg.content);
            res.save();
            puanData.findOne({ guild: msg.guild.id, user: msg.author.id }, async (err, puan) => {
              if (!puan) {
                new puanData({ guild: msg.guild.id, user: msg.author.id, point: 5 }).save();
              } else {
                puan.point = (puan.point + 5);
                puan.save();
              }
            });
            return;
          } else;
          msg.react(green);
          puanData.findOne({ guild: msg.guild.id, user: msg.author.id }, async (err, puan) => {
            if (!puan) {
              new puanData({ guild: msg.guild.id, user: msg.author.id, point: 1 }).save();
            } else {
              puan.point = (puan.point + 1);
              puan.save();
            };
          });
          res.letter = (msg.content.charAt(msg.content.length-1));
          res.user = (msg.author.id);
          res.word = (msg.content);
          res.save();
        };
      });
    } else;
  });
});

// Functions

client.message = (content, channel, timeout) => {
  const kanal = client.channels.cache.get(channel);
  if (kanal) {
    kanal.send(content).then(msg => msg.delete({ timeout: timeout }));
  } else;
};

client.embed = (message, msg) => {
  return {
    embed: {
      author: {
        name: msg.author.tag,
        icon_url: msg.author.avatarURL({ dynamic: true })
      },
      description: message,
      color: client.colors
    }
  }
};
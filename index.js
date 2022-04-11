const { Client , MessageEmbed } = require(`discord.js`);
const settings = global.settings = require(`./settings.json`)
const mongoose = require(`mongoose`);
const client = global.client = new Client({
fetchAllMembers:true,
intents:[32767],
presence:{
activities:[{name:settings.activities}],
status:settings.status
}})
require(`./helpers/function`);
require(`./helpers/mongoDB`);
const operation = require(`./helpers/transactions`)

client.once("ready", async() => {
  console.log(`${client.user.tag} adlı bot ile giriş yapıldı!`)   
})

client.on(`messageCreate`,async(message) => {
  let embed = new MessageEmbed().setColor('RANDOM').setAuthor({ name: message.author.username, iconURL: message.author.avatarURL({ dynamic: true })}).setFooter({ text: `Legrox was here!`, iconURL: message.author.avatarURL({ dynamic: true }) }).setTimestamp()
  let prefix = settings.prefix.find((x) => message.content.toLowerCase().startsWith(x));
  if (message.author.bot || !message.guild || !prefix) return;
  let args = message.content.substring(prefix.length).trim().split(" ");
  let commandName = args[0].toLowerCase();
  if(!commandName) return 
  if(!settings.owners.includes(message.author.id)) return message.reply(`Bu komutu kullanabilmek için \`owner\` olmanız gerekiyor!`)
  if(commandName == "işlemler") {
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[1]) || message.member;
    if(!member) return message.reply(`Lütfen bir kullanıcı etiketleyin ve tekrar deneyin.`)
    let data = await operation.find({ guildID: message.guild.id, userID: member.user.id,}).sort({ date: -1 });
    const user = message.guild.members.cache.get(member.id)
    const transactions = data.length > 0 ? data.slice(0, 10).map((value, index) => `\`#${value.id}\` **[${value.type}]** <@${value.userID}> adlı kullanıcı **${new Date(value.time).toTurkishFormatDate()}** tarihinde, ${value.text} işlemini yapmış!`).join("\n\n") : "";
    await message.channel.send({ embeds:[embed.setThumbnail(user.avatarURL({ dynamic: true })).setDescription(`${member ? member.toString() : `**${user.username}**`} Adlı kullanıcının işlem bilgileri aşağıda verilmiştir.\n\n ${transactions}`)] })
}
  if(commandName == "işlem-sıfırla") {
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[1]) 
    if(!member) return message.reply(`Lütfen bir kullanıcı etiketleyin ve tekrar deneyin.`)
    await operation.deleteMany({userID:member.id})
    await message.channel.send({embeds: [embed.setDescription(`${member}, adlı kullanıcının işlem geçmişi başarıyla sıfırlandı!`)]})
  }

})
// MEMBER
client.on(`guildBanAdd`, async ban => {
let entry = await ban.guild.fetchAuditLogs({type: 'MEMBER_BAN_ADD'}).then(audit => audit.entries.first());
if(!entry || !entry.executor) return;
const user = ban.guild.members.cache.get(entry.executor.id)
await client.process(settings.guildID, user, `BAN_ADD`,` \`${ban.user}\` adlı kullanıcıyı yasaklama`, Date.now())
})
client.on(`guildMemberAdd`, async member => {
let entry = await member.guild.fetchAuditLogs({type: 'BOT_ADD'}).then(audit => audit.entries.first());
if(!entry || !entry.executor) return;
const user = member.guild.members.cache.get(entry.executor.id)
await client.process(settings.guildID, user, `BOT_ADD`,` \`${member.user}\` adlı botu sunucuya çekme`, Date.now())
})
client.on(`guildMemberRemove`, async member => {
let entry = await member.guild.fetchAuditLogs({type: 'MEMBER_KICK'}).then(audit => audit.entries.first());
if(!entry || !entry.executor) return;
const user = member.guild.members.cache.get(entry.executor.id)
await client.process(settings.guildID, user, `MEMBER_KICK`,` \`${member.user}\` adlı kullanıcıyı atmak`, Date.now())
})
client.on(`guildMemberRemove`, async member => {
let entry = await member.guild.fetchAuditLogs({type: 'MEMBER_PRUNE'}).then(audit => audit.entries.first());
if(!entry || !entry.executor) return;
const user = member.guild.members.cache.get(entry.executor.id)
await client.process(settings.guildID, user, `MEMBER_PRUNE`,`sunucuda ki üyeleri çıkartmak`, Date.now())
})

//CHANNEL
client.on(`channelCreate`, async channel => {
let entry = await channel.guild.fetchAuditLogs({type: 'CHANNEL_CREATE'}).then(audit => audit.entries.first());
if(!entry || !entry.executor) return;
const user = channel.guild.members.cache.get(entry.executor.id)
await client.process(settings.guildID, user.id, `CHANNEL_CREATE`,` \`${channel.name}\` adlı kanalı oluşturma`, Date.now())
})
client.on(`channelDelete`, async channel => {
let entry = await channel.guild.fetchAuditLogs({type: 'DELETE'}).then(audit => audit.entries.first());
if(!entry || !entry.executor) return;
const user = channel.guild.members.cache.get(entry.executor.id)
await client.process(settings.guildID, user.id, `CHANNEL_DELETE`,` \`${channel.name}\` adlı kanalı silme`, Date.now())
})
client.on(`channelUpdate`, async(oldChannel,newChannel) => {
let entry = await oldChnannel.guild.fetchAuditLogs({type: 'CHANNEL_UPDATE'}).then(audit => audit.entries.first());
if(!entry || !entry.executor) return;
const user = oldChannel.guild.members.cache.get(entry.executor.id)
await client.process(settings.guildID, user.id, `CHANNEL_UPDATE`,` \`${oldChannel.name}\` adlı kanalı güncelleme`, Date.now())
})

// ROLE
client.on(`roleCreate`, async role => {
let entry = await role.guild.fetchAuditLogs({type: 'ROLE_CREATE'}).then(audit => audit.entries.first());
if(!entry || !entry.executor) return;
const user = role.guild.members.cache.get(entry.executor.id)
await client.process(settings.guildID, user.id, `ROLE_CREATE`,` \`${role.name}\` adlı rolü oluşturma`, Date.now())
})
client.on(`roleDelete`, async role => {
let entry = await role.guild.fetchAuditLogs({type: 'ROLE_DELETE'}).then(audit => audit.entries.first());
if(!entry || !entry.executor) return;
const user = role.guild.members.cache.get(entry.executor.id)
await client.process(settings.guildID, user.id, `ROLE_DELETE`,` \`${role.name}\` adlı rolü silme`, Date.now())
})
client.on(`roleUpdate`, async (oldRole,newRole) => {
let entry = await oldRole.guild.fetchAuditLogs({type: 'ROLE_UPDATE'}).then(audit => audit.entries.first());
if(!entry || !entry.executor) return;
const user = oldRole.guild.members.cache.get(entry.executor.id)
await client.process(settings.guildID, user.id, `ROLE_UPDATE`,` \`${oldRole.name}\` adlı rolü güncelleme`, Date.now())
})

// GUİLD
client.on(`guildUpdate`, async (oldGuild,newGuild) => {
let entry = await oldGuild.guild.fetchAuditLogs({type: 'GUİLD_UPDATE'}).then(audit => audit.entries.first());
if(!entry || !entry.executor) return;
const user = oldGuild.guild.members.cache.get(entry.executor.id)
await client.process(settings.guildID, user.id, `GUİLD_UPDATE`,` sunucu ayarlarıyla oynama`, Date.now())
})
client.on(`webhookUpdate`, async (oldGuild,newGuild) => {
let entry = await oldGuild.guild.fetchAuditLogs({type: 'WEBHOOK_CREATE'}).then(audit => audit.entries.first());
if(!entry || !entry.executor) return;
const user = oldGuild.guild.members.cache.get(entry.executor.id)
await client.process(settings.guildID, user.id, `WEBHOOK_CREATE`,` sunucuda webhook oluşturma`, Date.now())
})


client.login(settings.token).catch(() => {console.log(`Bot giriş yaparken bir hata ile karşılaştı!`)})

const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    
let loading = await message.channel.send({ content: `Mesaj Seviye İstatistiklerin Yükleniyor!`});
loading.delete();

 async function CreatedLevelSystem(member, levelData) {
    const canvas = Canvas.createCanvas(700, 180);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#2C2F33';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(75, 90, 65, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.stroke();

    const avatar = await loadImage(member.displayAvatarURL({ format: 'png' }));
    ctx.save();
    ctx.beginPath();
    ctx.arc(75, 90, 60, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, 15, 30, 120, 120);
    ctx.restore();
   
    const status = member.presence?.status || 'offline';
    let KullanıcıDurum;

    switch (status) {
        case 'online':
            KullanıcıDurum = '#008000';
            break;
        case 'idle':
            KullanıcıDurum = '#ffff00';
            break;
        case 'dnd':
            KullanıcıDurum = '#ff0000';
            break;
        default:
            KullanıcıDurum = '#696969';
            break;
    }
   
   
   ///////////////////İSTERSENİZ BURAYI KULLANABİLİRSİNİZ SİZE KALMIŞ////////////////////////////////
 
   // const status = member.presence?.status || 'offline';
  // let KullanıcıDurumIcon;
  // switch (status) {
         // case 'online':
         //   KullanıcıDurumIcon = 'ICON RESİM ID';
         //   break;
         // case 'idle':
         //  KullanıcıDurumIcon = 'ICON RESİM ID';
         // break;
         // case 'dnd':
         //  KullanıcıDurumIcon = 'ICON RESİM ID';
         // break;
         // default:
         // KullanıcıDurumIcon = 'ICON RESİM ID';
         //break;
    // }
  
   //////////////////////////////////////////////////////

    ctx.fillStyle = KullanıcıDurum;
    ctx.beginPath();
    ctx.arc(130, 120, 15, 0, Math.PI * 2, true);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 25px Arial';
    ctx.fillText(`SIRA #${levelData.rank}`, 380, 50);
    ctx.fillStyle = '#00aaff';
    ctx.fillText(`SEVİYE ${levelData.level}`, 550, 50);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 23px Arial';
    ctx.fillText(`${member.displayName}`, 160, 120);

    ctx.fillStyle = '#40444B';
    ctx.fillRect(160, 130, 500, 30);    

    const xpWidth = (levelData.currentXp / levelData.requiredXp) * 350;
    ctx.fillStyle = '#00aaff';
    ctx.fillRect(160, 130, xpWidth, 30);   

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px Arial';
    ctx.fillText(`${Math.round((levelData.currentXp / levelData.requiredXp) * 100)}%`, 390, 153); // BU KISIM XP YÜZDE KISMI 

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 21px Arial';
    ctx.fillText(`${levelData.currentXp} / ${levelData.requiredXp}`, 520, 120);     // BU KISIM XP Bilgisi

    return canvas.toBuffer();
}

const TümLevel = await LevelSystem.find({ guildID: message.guild.id }).sort({ Message_XP : -1 }).exec();
const KullanıcıLevel = TümLevel.findIndex(l => l.userID === member.user.id) + 1;

const Level = await LevelSystem.findOne({ guildID: message.guild.id, userID: member.user.id });
const levelData = {
    rank: KullanıcıLevel,
    level: Level ? Level.Message_Level : 1,
    currentXp: Level ? Level.Message_XP : 1,
    requiredXp: Level.Message_Level*350,
};

const buffer = await CreatedLevelSystem(member, levelData);
const attachment = new MessageAttachment(buffer, 'level.png');

message.channel.send({ files: [attachment] });
}
}

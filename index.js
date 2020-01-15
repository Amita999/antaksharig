const express = require('express');
const app = express();
const mongoose = require('mongoose');
let SongI = require('./models/songs');
//const logic = require('./logic');
const port = process.env.PORT||4100;
const SongU = require('./models/usongs');


app.use(express.json());

mongoose.connect('mongodb://localhost/songs',{useNewUrlParser:true})
.then(() =>console.log('connection successful'))
.catch((err)=>console.log('Something went wrong',err.message));

app.post('/songs',async(req,res) =>{
    try{
        
      let uSong =await SongI.Songs.findOne({identifier:req.body.identifier});
      if(uSong)
      {

          uSong.Song=req.body.Song;
          let data = await uSong.save();
          return res.status(200).send({message:'Data updated'}) 
        }
else{
    let song =  SongI.Songs({
        title:req.body.title,
        firstword:req.body.firstword,
        lastword:req.body.lastword,
        identifier:req.body.identifier,
        lastUpdated:req.body.lastUpdated,
        Song:req.body.Song
  })
  let data = await song.save();
        res.send(data);
}      
    
}
 catch(err){
 console.log(err.message);
        }
        });




//gET REQUEST
const letterFilter = new Set(['ँ','ं','ः','़','ा','ि','ी','ु','ू','ृ','ॅ','े','ै','ॉ','ो','ौ','्','ा','े','ी','ं','्','ो','ै','ु','ू','़','ँ','ॉ','ृ','ः','ॅ']);

const getFirstLetterFromWord  = function (str) {
// Start from the end of the string.
for(let i = 0 ; i <= str.length - 1; i--) {

// If the letter is not in the filter list, then we have our last character.
if (!letterFilter.has(str.charAt(i))) {
return str.charAt(i);
}
// Let's consider the previous character in next iteration
}
// We reached the end of the string and found no valid character.
return false;
};

// Print the output.
// console.log("हिंदी starts with " + getFirstLetterFromWord('हिंदी'));
// console.log("हमको तुमसे प्यार है starts with " + getFirstLetterFromWord('हमको तुमसे प्यार है'));
// console.log("मेरे सपनों की रानी starts with " + getFirstLetterFromWord('मेरे सपनों की रानी'));
// console.log("कभी कभी मेरे दिल में खयाल आता है starts with " + getFirstLetterFromWord('कभी कभी मेरे दिल में खयाल आता है'));
// console.log("एक तोह कम ज़िंदग… उस से भी कम है जवानी starts with " + getFirstLetterFromWord('एक तोह कम ज़िंदग… उस से भी कम है जवानी'));


//var fw = getFirstLetterFromWord('ह');
// console.log(fw);
//already in a collection 



app.get('/songs',async (req,res) =>{
    var fl = req.query.first_word;
    var id = req.query.user_id;
    //return console.log({fl: fl, id: id});
    let data = await SongI.Songs.find();
    console.log("value of data " +data);
            let Data = await getSongToSend(data, req, res)
            let element = Data[0];
            let userID = Data[1]
            console.log("value of element " +element);
            if(Data){
            res.send({message:'Song is played',item:element});}
           // else{res.status(402).send({message:'Song not found'});}
            let elementReturnedSave = new SongU.uSongs({
                title:element.title,
                user_id : userID,
                firstword:element.firstword,
                lastword:element.lastword,
                identifier:element.identifier,
                lastUpdated:element.lastUpdated,
                Song:element.Song
            });
            await elementReturnedSave.save();
            // let elementRemovefromSong = await SongI.Songs.findOneAndRemove(element.identifier);

            
});

async function getSongToSend(data, req, res){
    return new Promise( (resolve, reject ) => {
    data.forEach(async (element) =>  {
        
            console.log("data.firstword " +element.firstword)
            let firstLetterFromSong = getFirstLetterFromWord(element.firstword);
            //console.log("value of params fl " + JSON.stringify(fl))
            let valUefromParam = req.query.first_word;
            console.log("valUefromParam" +valUefromParam);
            console.log("firstLetterFromSong" +firstLetterFromSong);
             if(firstLetterFromSong == valUefromParam)
            {
            let ifSongServed = await (checkSongServed(element, req))
            console.log("ifSongServed "+ ifSongServed)
            if(!ifSongServed){
               //  return element;
               console.log("value of element " +element);
                // return element
            console.log("value of val " + element)
            resolve([element, req.query.user_id])
             }else{
                 console.log("else of Promise")
                 res.send('Song Not found');
             }
        }
 });
 })}

    async function checkSongServed(element, req){
        let id = element.identifier;
        let songPlayed = await SongU.uSongs.findOne({$and :[{"identifier":id}, {"user_id": req.query.user_id}]});
        console.log("value of song played "+ JSON.stringify(songPlayed))
        if(songPlayed){
        return true;
        }
        else {return false;}
        }

   
app.listen(port,() =>{console.log('Server connected')});

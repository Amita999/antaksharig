const express = require("express");
const app = express();
const mongoose = require("mongoose");
let SongI = require("./models/songs");
//const logic = require('./logic');
const port = process.env.PORT || 3000;
const SongU = require("./models/usongs");
const morgan = require("morgan");
app.use(morgan("combined"));
const sanscript = require("@sanskrit-coders/sanscript");

app.use(express.json());

mongoose
  .connect("mongodb://localhost/songs", { useNewUrlParser: true })
  .then(() => console.log("connection successful"))
  .catch(err => console.log("Something went wrong", err.message));

//Extraction of firstLetter and lastLetter
const getLastLetterFromWord = function(str) {
  // Start from the end of the string.
  for (let i = str.length - 1; i >= 0; i--) {
    // If the letter is not in the filter list, then we have our last character.
    if (!letterFilter.has(str.charAt(i))) {
      return str.charAt(i);
    }
    // Let's consider the previous character in next iteration
  }
  // We reached the end of the string and found no valid character.
  return false;
};
const getFirstLetterFromWordTrans = function(str) {
  return str.charAt(0);
}
//console.log(transliterateFirst("Amita"))
//console.log(transliterateLast("jethani"))

 const transliterateFirst = function(str) {
	     let output = str + " - ";
	     let hindiWord = sanscript.t(str.toLowerCase().trim(), "itrans", "devanagari", { syncope: true });
	     return getFirstLetterFromWordTrans(hindiWord);
	   };
  
  const transliterateLast = function(str) {
	      let output = str + " - ";
	      let hindiWord = sanscript.t(str.toLowerCase().trim(), "itrans", "devanagari", { syncope: true });
	      return getLastLetterFromWord(hindiWord);
	    };

app.post("/songs", async (req, res) => {
  try {
    let songs = req.body.data;
    console.log("Data from body as object" + JSON.stringify(songs));
    songs.forEach(async element => {
      let JSONdata = element;
      console.log("Entered forEach with current element as " + JSONdata);
      let uSong = await SongI.Songs.findOne({
        identifier: JSONdata.identifier
      });
      if (uSong) {
        uSong.Song = JSONdata.Song;
       uSong.lastUpdated =JSONdata.lastUpdated;
	 await uSong.save();
      } else {
        let FL = JSONdata.firstword;
        // console.log("FL :", transliterate(FL) );
        let LL = JSONdata.lastword;
        //console.log("LL :", transliterate(LL) );

        let song = await SongI.Songs({
          title: JSONdata.title,
          firstword: JSONdata.firstword,
          lastword: JSONdata.lastword,
          firstLetter: transliterateFirst(FL),
          lastLetter: transliterateLast(LL),
          identifier: JSONdata.identifier,
          lastUpdated: JSONdata.lastUpdated,
          Song: JSONdata.Song
        });
        console.log("song:" + song);

        await song.save();
      }
    });
    res.status(200).send({ message: "Data saved successfully",status:"200" });
  } catch (err) {
    console.log(err.message);
  }
});

//Logic
const letterFilter = new Set(['ँ', 'ं', 'ः', '़', 'ा', 'ि', 'ी', 'ु', 'ू', 'ृ', 'ॅ', 'े', 'ै', 'ॉ', 'ो', 'ौ', '्', 'ा', 'े', 'ी', 'ं', '्', 'ो', 'ै', 'ु', 'ू', '़', 'ँ', 'ॉ', 'ृ', 'ः', 'ॅ']);

const getFirstLetterFromWord = function(str) {
  // Start from the end of the string.
  for (let i = 0; i <= str.length - 1; i--) {
    // If the letter is not in the filter list, then we have our last character.
    if (!letterFilter.has(str.charAt(i))) {
      return str.charAt(i);
    }
    // Let's consider the previous character in next iteration
  }
  // We reached the end of the string and found no valid character.
  return false;
};

//Get request

app.get("/songs", async (req, res) => {
  var fl = req.query.first_word;
  var id = req.query.user_id;
  let data = await SongI.Songs.find();
//  console.log("value of data " + data);
//	console.log("value of req in get"+req)
   await getSongToSend(data, req, res).then(
    async  (positive) =>{
      console.log("value of positive " + positive);
      let element = positive[0];
      let userID = positive[1];
   //  console.log("value of element " + element);
      if (element) {
        let elementReturnedSave = new SongU.uSongs({
          title: element.title,
          user_id: userID,
          firstword: element.firstword,
          lastword: element.lastword,
          identifier: element.identifier,
          lastUpdated: element.lastUpdated,
          Song: element.Song
        });
     //   console.log("elementReturnedSave" + JSON.stringify(elementReturnedSave))
      await elementReturnedSave.save().then(() =>{
        return res.send({ message: "Song is played", status:true, code : 200, song:element});
      }).catch(( )=>{
        res.status(402).send({message:'Song not found',status:false, code : 402});
      })
      
      }
     
    }
      ).catch(negative => res.send(negative));
  

});

 function getSongToSend(data, req, res) {
  let served = false;
  return new Promise((resolve, reject) => {
    data.every(async (element) => {
     // console.log("data.firstword " + element.firstword);
      let firstLetterFromSong = element.firstLetter;
      //console.log("value of params fl " + JSON.stringify(fl))
      let valUefromParam = req.query.first_word;
      console.log("valUefromParam" + valUefromParam);
      
	    console.log("firstLetterFromSong" + firstLetterFromSong);
  //    if (firstLetterFromSong == valUefromParam) {
        let ifSongServed = await  checkSongServed(element, req);
     

	      console.log("ifSongServed " + ifSongServed);
	      if(ifSongServed == false){
       if (firstLetterFromSong == valUefromParam){
	    //  if (ifSongServed==false) {
          //return element;
        //  console.log("value of element " + element);
          // return element
       //   console.log("value of val " + element);
        //	return false
		served = true;
		console.log("song found")
        resolve([element, req.query.user_id]);
		return false
     //   throw "song found"
        
	}else{
	
	      
        let indexOfElement = data.indexOf(element)
        console.log("indexOfElementforSongAlreadyPlayed" +indexOfElement)
        console.log("data length of matching" +data.length)
        if(indexOfElement == (data.length)-1){
          reject({message:'Song is already played for that user',status:false,code:401})
       		return false
	} return true}
      }else{
	      
        let indexOfElement = data.indexOf(element)
        console.log("indexOfElement" +indexOfElement)
        console.log("data length" +data.length)
        if(indexOfElement == (data.length)-1){
          reject({message:'Song is already played for that user',status:false,code:401})
		return false
        }return true
      }
    })
 
       //reject([]);
  });
}

async function checkSongServed(element, req) {
  let id = element.identifier;
  let songPlayed = await  SongU.uSongs.findOne({
    $and: [{ identifier: id }, { user_id: req.query.user_id }]
  });
//  console.log("value of song played " + JSON.stringify(songPlayed));
  if (songPlayed) {
    return true;
  } else {
    return false;
  }
}

app.listen(port, () => {
  console.log("Server connected");
});

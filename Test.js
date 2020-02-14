const express = require("express");
const app = express();
const mongoose = require("mongoose");
let SongI = require("./models/songs");
const morgan = require("morgan");
app.use(morgan("combined"));
const sanscript = require("@sanskrit-coders/sanscript");
//const port = process.env.PORT || 4100;

//Logic
const letterFilter = new Set(['ँ', 'ं', 'ः', '़', 'ा', 'ि', 'ी', 'ु', 'ू', 'ृ', 'ॅ', 'े', 'ै', 'ॉ', 'ो', 'ौ', '्', 'ा', 'े', 'ी', 'ं', '्', 'ो', 'ै', 'ु', 'ू', '़', 'ँ', 'ॉ', 'ृ', 'ः', 'ॅ']);

mongoose
  .connect("mongodb://localhost/songs", { useNewUrlParser: true })
  .then(() => console.log("connection successful"))
  .catch(err => console.log("Something went wrong", err.message));


  //Transliteration of firstword and last word
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
  };
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



async function updateDB(){
     
  
//        try{
            let songsCollection = await SongI.Songs.find({});
         songsCollection.forEach(async element =>{
             let songData = element;
          
            // console.log("trans " +transliterateFirst(' M  '))
             
                   element.firstLetter= transliterateFirst(element.firstword);
                   element.lastLetter= transliterateLast(element.lastword);
                    await element.save();
                    console.log("element saved")
                
             
         })
  //      }catch(Excepetion e){
      //      console.log("data not updated+"+ e)
    //    }
         
     }
     
updateDB();

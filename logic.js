// Set of 'dependent alphabet characters in hindi'
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
console.log("हिंदी starts with " + getFirstLetterFromWord('हिंदी'));
console.log("हमको तुमसे प्यार है starts with " + getFirstLetterFromWord('हमको तुमसे प्यार है'));
console.log("मेरे सपनों की रानी starts with " + getFirstLetterFromWord('मेरे सपनों की रानी'));
console.log("कभी कभी मेरे दिल में खयाल आता है starts with " + getFirstLetterFromWord('कभी कभी मेरे दिल में खयाल आता है'));
console.log("एक तोह कम ज़िंदग… उस से भी कम है जवानी starts with " + getFirstLetterFromWord('एक तोह कम ज़िंदग… उस से भी कम है जवानी'));


const cheerio = require('cheerio');
const request = require('request');
const { DownloaderHelper } = require('node-downloader-helper');
const fs = require('fs');

//page to scan
const URL = 'https://memegen.link/examples';

//create folder if doens't exist
!fs.existsSync(`./memes`) && fs.mkdirSync(`./memes`, { recursive: true });

request(URL, function (err, resp, html) {
  //If there is no error
  if (!err) {
    console.log('Scanning website');
    //The URL Data
    const $ = cheerio.load(html);

    //Save embeded urls
    const returnInfo = [];

    //Treverse the webpage and select the media elements
    $('img').each(function (i, element) {
      //only pull first 10 items
      if (i < 10) {
        const temp = $(element).attr('src'); //Create a reference for the image element was this
        returnInfo.push('https://memegen.link' + temp); //Add the URL address to the return info array
      }
    });
    //console.log(returnInfo); testing

    //Try to output the url, if it doesn't exist or there is a problem it will log it out for us
    try {
      console.log('Downloading first 10 memes');

      //dowload the images
      for (let i = 0; i < returnInfo.length; i++) {
        const dl = new DownloaderHelper(returnInfo[i], './memes');
        // dl.on('end', () => console.log('Download Completed')); *for ea DL
        dl.start();

        //learned new option from Hamed
        //   returnInfo.map(item =>
        //     {const dl = new DownloaderHelper(item, __dirname);
        //       dl.on('end', () => console.log('Download Completed'));
        //     })

        dl.on('end', () => console.log('Download Completed'));
      }
      
    } catch (e) {
      //Output the error
      console.log('Error in the output process: ' + e);
    }
  } else {
    //There was an error with our request
    console.log('Error in webscrape process: ' + err);
  }
});

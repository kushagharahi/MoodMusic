var ToneAnalyzerV3 = require("watson-developer-cloud/tone-analyzer/v3");

var tone_analyzer = new ToneAnalyzerV3({
  url: "https://gateway.watsonplatform.net/tone-analyzer/api",
  password: "kHNhWiuLgPES",
  username: "ccc2e192-5aed-4834-ae90-8af66cbf2b32",
  version_date: "2016-05-19"
});

var text = "I let it fall, my heart, And as it fell you rose to claim it It was dark and I was over Until you kissed my lips and you saved me My hands, theyre strong But my knees were far too weak";

  tone_analyzer.tone({ text: text },
  function(err, tone) {
    if (err)
      console.log(err);
    else {
      //console.log(tone);
      console.log(tone["document_tone"]["tone_categories"][0]["tones"][0]["score"]); //anger
      console.log(tone["document_tone"]["tone_categories"][0]["tones"][1]["score"]); //fear
      console.log(tone["document_tone"]["tone_categories"][0]["tones"][2]["score"]); //disgust
      console.log(tone["document_tone"]["tone_categories"][0]["tones"][3]["score"]); //joy
      console.log(tone["document_tone"]["tone_categories"][0]["tones"][4]["score"]); //sadness
      //console.log(JSON.stringify(tone, null, 2));
     }
});
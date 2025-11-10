# gwern on Substack

**URL:** https://astralcodexten.substack.com/p/open-thread-284/comment/18354821

**Created:** 2023-08-11T17:27:08.869Z

**Tags:** 

**Favorite:** false

## Excerpt

This is something I've long noticed. Generative music is highly feasible: spend some time listening to random OpenAI Jukebox samples https://jukebox.openai.com/ and note that this is generating raw audio from scratch, posted in *2020* using 2019 stuff, and not as scaled-up as GPT-3 was, and there's vastly more accessible audio data. You could also get fairly reasonable samples from non-raw-audio data sources with a few tricks (https://gwern.net/gpt-2-music) which sound even better if you put a tiny bit of effort into them (https://soundcloud.com/theshawwn/sets/ai-generated-videogame-music). So, where is it all?  It seems to be a combination of: (1) the copyright situation is much scarier. Music comes with *all sorts* of bizarre complex IP laws and rights that don't apply to text or images, and this is because of (and empowers) groups like the RIAA. Every commercial startup doing music-related generative work seems to keep things very quiet, as blackbox as possible, restricting to licensed datasets when possible, and definitely not releasing stuff. (2) lack of major hobbyist interest - people may like to listen to music, but a lot of it is parasocial, there's superstar winner-take-all effects, and people don't generally want to make their own music the way they do their own images & text - think about porn/hentai as a huge driver of image synthesis. There is no porn/hentai of music generative models. (3) relatively demanding compute compared to other modalities. Audio is just very, very bulky: a piece of music is made out of millions of individual datapoints (X frequencies times Y milliseconds), while you can make a recognizable image with just 64x64=4096 pixels. Jukebox wasn't as demanding as GPT-3-175b was... but it's still a lot more compute than most people want to spend. Even sampling Jukebox is pushing it: early use of the released Jukebox model deterred hobbyists when they realized it (a) didn't fit in their consumer GPUs and (b) would take like half a day to generate a full audio file. Yikes. It'd be a lot better today, of course, but is nowhere near the instant gratification of a GAN or near-instant of the OA API or heavily-optimized diffusion model.  I'd also note that images specifically has benefited from luck: you would be seeing way less generated images today, and you would be unimpressed by image progress, if Emad hadn't done what all of the giants refused to do and bankrolled a decent FLOSS image generation model. (You would be wrong to be unimpressed, because there were, and still are, many much better image generation models than the Stability ones, and trying to judge image generation SOTA by what an SD model can or cannot do is a serious mistake - but they are all locked up behind barriers so you can't use them.)

## Cover Image

![Cover](https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2F3a41d1b8-0e3c-44d4-b99a-8f52362678eb_1592x1800.png)


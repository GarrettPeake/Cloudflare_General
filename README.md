# Application to Cloudflare (General)

### About
This project was built as part of the application process for Cloudflare's summer 2022 recruitment process.
It uses workers and pages to implement a serverless social media platform  
The site is live at <tbd>

### The Process

**Issues**:  
* The OAuth page for wrangler had CORS errors, this should probably be fixed
* Generating workers api keys wasn't possible as it would just throw errors

**Cool things I learned**:
* Workers don't have cold starts!
* Pages offers the same features with higher free caps than Netlify
* Tailwind CSS is AWESOME
* You can push to two remote repos at once

**Time this took**: Around 8 hours
> Day 1: 6 hours   
> >  Errors with wrangler ~ 10 minutes  
> >  Setup Dev environment ~ 30 minutes (wasted time trying to use Python, switched to Javascript)  
> >  Deciding on data models ~ 10 minutes  
> >  Structuring Code and Reading Documentation ~ 100 minutes  
> >  Attempting/Debugging first deploy ~ 15 minutes  
> >  Errors with nodejs version ~ 10 minutes  
> >  Experimenting with wrangler dev ~ 10 minutes  
> >  Learned to use burp for easy endpoint testing ~ 25 minutes  
> >  Debugged worker and published ~ 75 minutes  
> >  Setting up react with tailwind (I'll be learning tailwind as I do this) ~ 10 minutes
> >  Building out prelim UI and implementing fetching ~ 110 minutes 

> Day 2: 2 hours   
> >  Styling (Haven't honed my eye for design yet) ~ 2 hours  
> >  Testing deploy to pages  
> >  Creating fake users and posts  

**Data Format**:
```
user format:
username : {
    name: string
    pfp: url
}

post format:
uuid : {
    username: string
    location: string
    date: int
    images: [url...]
    text: string
    likes: int
    comments: [{
        username: string
        text: string
    }]
}
```
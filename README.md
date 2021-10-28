# Application to Cloudflare (General)

### About
This project was built as part of the application process for Cloudflare's summer 2022 recruitment process.
It uses workers and pages to implement a serverless social media platform  
The site is live at cloudflare-general.pages.dev

### The Process

**Cool things I learned**:
* Workers don't have cold starts!
* Pages offers the same features with higher free caps than Netlify
* Tailwind CSS is AWESOME
* You can push to two git repos at once
* This makes for a pretty cool portfolio site!

**Time this took**: Around 8 hours for the minimum, another 10 because I started having fun and thought it'd make a good portfolio piece
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

> Day 3: 3 hours  
> > Adding editing capabilties  
> > Styling  
  
> Day 4: 4 hours  
> > Adding editing capabilties  
> > Styling 

> Day 5: 1 hour
> > Adding posts

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
    images: [url...]
    date: int
    text: string
    likes: int
    comments: [{
        username: string
        text: string
    }]
}
```
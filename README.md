# Blog-API
 Blog API, major project from The Odin Project

npm install express express-session mongoose passport passport-local ejs nodemon dotenv

npm install bcryptjs express-async-handler express-validator

Apr 30
- 
* Initial plans / and initial repo

May 4 - May 9
- 
* need natin ng frontend para sa presentation. For example yung pagkakalagay ng Title, Header, Body, tapos yung different types of fonts, etc.☑️

* I tried connecting to mongoDB, in a cluster, but with a different databases. and I have to specify which database should I connnect to.☑️

* Sign up for regular accounts☑️

May 6
* Logging in as the admin / blog author☑️
    - log-out
    - ilagay nalang natin yung login sa front page (index)

* Work out on isAdmin flag
    - pano ngayon ang gagawin here. thinking of putting it in the sign up page pero it needs a passcode or something (pwede) ☑️

May 7
* Rewritten the routes
    - maximizing the express.Router() to make the writing of URL simpler

May 9
* Styling of the blog page (may paggagayahan na haha)
    - magkaiba pagka login ng regular accounts at ng mga blog authors
    - style StackOverflow pala mangyayari dito. maglalogin yung mga magcocomments or upvote, but anyone can see the posts whether logged in or not

May 11
* tidied up the initial pages (20% progress)


* Distinction between log-in pages of common account and blog author. 

May 12 - May 18
- 
* Let's make the Blog Author account
    - view post  (also for common account)
    - create/ edit / delete post
    - comments (also for common account)
* May 12 - 13
    - can create post now (Blog Author account)
    - displayed published posts for public and logged accounts
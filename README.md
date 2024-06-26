# Blog-API
 Blog API, major project from The Odin Project (server end)

npm install express express-session mongoose passport passport-local ejs nodemon dotenv

npm install bcryptjs express-async-handler express-validator

npm install passport-jwt jsonwebtoken

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
        - view post  (also for common account) ☑️
        - create/ edit / delete post ☑️
        - merging this one with front end. need two other repos according to the project

* May 12 - 13
    - can create post now (Blog Author account) 
    - displayed published posts for public and logged accounts 
    - make the blog presentable 

* May 14
    -  blog author now displayed by using populate() (finally)
    - now using the formatted date using luxon (as a virtual schema property, again, finally!)
    - edit and delete post done
        - deleting has been easy, and the first parts of update
        - but I spent so much time debugging the update schema parts, since I modified the fields of the update schema, and I did some trial and error

* May 15
    - cleaning up the code, cleaning up the update button (60% done, functional)
        - update is now clean, i put express validator to not accept messages beyond 7000 words
        - tidying up the url, adding two parameters
    - working on comments (part 1: conceptualizing) 
        - ☑️when in public, there is a comment button, which will redirect you to log in

* May 16
    - working on comments (part 2)
        - when clicking the add a comment button, it will alternate display with a 'mini form'
        - stuck at the button onclick in ejs

* May 17
    - i think I need to incorporate reactjs na. I have some problems with the EJS regarding the buttons. (currently implementing vite+reactjs)

* May 18
    - need gumawa ng 2 separate repos for the front end. first time ko ito gawin soo☑️
    - successfully fetched something from server

    - I'm reviewing React right now



May 19 - 26
-   
    * comments (also for common account)
    * published / unpublished posts
        * unpublished posts can be viewed by the blog authors?
        * published posts can be viewed by common accounts as well as the public

* May 24
    * finished reviewing the React (light review)

* May 26
    * main page of the blog is now rendering initially in React


June 10 - June 16
- 
    * Let's work on comments

* June 10
    * Working on comments
        - Written my first comment ☑️

* June 11
    * can write and display comment now (initial)


* June 24
    * JWT: given on log-in and is used in writing posts
    * JWT implemented also in update and delete posts

* June 30
    * Bug in submitting and deleting comment now fixed
        - doesn't need to render the App component just to manipulate the comments 
        - i need to do some work around the api.js in order to solve the bug
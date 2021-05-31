# Scuba diving website kooka

* How to setup local git repo

    1. create a new directory in your computer and inside it run `git init `;
    2. run `git clone git@github.com:rayguo17/scubaReservation.git`
    3. create your own branch `git branch {yourBranchName}`
    4. checkout to your branch `git checkout {yourBranchName}`
    5. work on your own branch

* How to commit changes to github
    
    1. run `git status` make sure don't include any confidential information in your code (e.g. password, port number, host address)
    2. run `git add . ` then `git commit -m {description}`
    3. run `git push origin {yourBranchName}`
    4. go to github and create a pull request wait for other people to approve
    5. after approve checkout to master branch(local repo) run `git checkout master`
    6.  run `git pull origin master`
    7. checkout to your own branch `git checkout {yourBranchName}`
    8. run `git merge master` merge your own branch with master

* see your progress [@notion](https://www.notion.so/564ec1df923c4b29a9fe2105ef6061d2?v=1c2bc90e706f425bbab02410cb7c7dbe)
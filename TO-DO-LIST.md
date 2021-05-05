# To-Do List <!-- omit in toc -->

- [Known Issues](#known-issues)
- [Areas for Improvement](#areas-for-improvments)

## Known Issues:
* Karma - Sometimes an [object object] error is thrown when running the Karma tests for the project. If built-in testing requirements are maintained going forward, it would be beneficial to find a way to resolve this issue.
* On the main dashboard of the context pack/learner display page, “Context Packs” and “Students” are clickable, and are supposed to take you down to the appropriate section when clicked, however, this does not work consistently.
* When you delete a context pack, it does not update the learner cards until the page is refreshed.
* Merriam Webster Dictionary suggestions are sometimes a little wonky. For example, when typing in friend as a word, it will return quaker as a suggestion. 
* Import wordlist validator does not work fully as intended. When submitting an empty json, it will say the json is valid, and it isn’t, and won’t allow you to import it.
* No server side authentication of user
* No limit on word forms. If you type a very long word form, the chip will run off the add word forms box.
* Learners are currently moved to the bottom of the list after being edited.

## Areas for Improvement:
* Test coverage - The server-side code coverage is at 100%, but the client-side code coverage can be improved.
* There could be a description of what Word River does on the home page.
* There are a number of commented out methods present within our code that were leftover during production. They should either be removed or reutilized in future iterations.
* A message should be displayed to the user when they try to upload a picture as an icon that is bigger than 5mb.
* There’s no search bar for the learners. This would be beneficial to have, especially when dealing with a longer list of learners.
* Currently, you can only change the icons of learners by uploading a new photo. In a future iteration, developers may wish to add the option to add a new icon through a URL.

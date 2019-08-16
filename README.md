Password Generator allows users to generate a password using criteria that they provide. The user can select the number of characters they want, and if they want to include numbers and/or symbols. It was created using HTML, CSS, and jQuery.

I created the password generation logic using jQuery, and it tries to create passwords which are easier for people to use on a daily basis. Most passwords will generally contain more letters (either lower or upper case) than numbers and letters, however will always inlucde at least 1 number and/or symbol (if they are selected). The password generation is by no means perfect, and it is highly recommened to use a larger number of characters (11-12 or more) when creating a randomly generated password.

The Password Generator also utilises the [zxcvbn](https://github.com/dropbox/zxcvbn) api, created by dropbox, for password strength estimation. Password Generator currently uses the password strength estimation to give the user a simple estimate on the password's strength, along with the password crack times using different environments.

Future improvements/TODO:
 - [ ] Include password hints from zxcvbn
 - [ ] Improve mobile interface
 - [ ] Create random-word password generation method

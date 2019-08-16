$(document).ready(function () {
    var numChar = localStorage["numberOfChars"] || 12;
    if (localStorage["useSymbols"] !== undefined) {
        var useSymbols = (localStorage["useSymbols"] == "true");
    } else {
        var useSymbols = true;
    }
    if (localStorage["useNums"] !== undefined) {
        var useNums = (localStorage["useNums"] == "true");
    } else {
        var useNums = true;
    }

    // Set the default values for the inputs
    $("#characternum").val(numChar);
    $("#symbols").prop("checked", useSymbols);
    $("#numbers").prop("checked", useNums);

    // hide the password crack times on start
    $("#password-crack-times").hide();
})

$("#generate").click(function () {
    var numberOfChars = parseInt($("#characternum").val());
    var useSymbols = $("#symbols").prop("checked");
    var useNumbers = $("#numbers").prop("checked");
    var charArray = [];

    var count = 0;

    while (count < numberOfChars) {
        //guarantee that there is atleast 1 number in the password
        if (useNumbers && count === 0) {
            var char = GenerateNumber();
            charArray.push(char);
            count++;
        }
        //guarantee that there is atleast 1 symbol in the password
        else if (useSymbols && count === 1) {
            var char = GenerateSymbol();
            charArray.push(char);
            count++;
        }
        else {
            var num = Math.floor(Math.random() * 6);
            if (useNumbers && num <= 1) {
                var char = GenerateNumber();
                charArray.push(char);
                count++;
            }
            else if (useSymbols && num >= 5) {
                var char = GenerateSymbol();
                charArray.push(char);
                count++;
            }
            else {
                var char = GenerateLetter();
                charArray.push(char);
                count++;
            }
        }
    }

    shuffle(charArray);
    $("#password").val(charArray.join(''));

    checkPasswordStrength();
});

function GenerateLetter() {
    var num = Math.floor(Math.random() * 3) + 1;

    if (num > 1) {
        // get a random lower case letter
        return String.fromCharCode(97 + Math.floor(Math.random() * 26));
    }
    else if (num === 1) {
        // get a random capital letter
        return String.fromCharCode(65 + Math.floor(Math.random() * 26));
    }
}

function GenerateNumber() {
    return Math.floor(Math.random() * 9);
}

function GenerateSymbol() {
    var symbols = "!@#$%^&*()/?";

    var i = Math.floor(Math.random() * symbols.length);
    return symbols.charAt(i);
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

$("#password").on("input", function () {
    checkPasswordStrength();
});

function checkPasswordStrength() {
    var strength = {
        1: "Worst <i class='em em-angry'></i>",
        2: "Bad <i class='em em-anguished'></i>",
        3: "Weak <i class='em em-disappointed'></i>",
        4: "Good <i class='em em-slightly_smiling_face'></i>",
        5: "Strong <i class='em em-star-struck'></i>"
    };
    var password = $("#password").val();
    var meter = $("#password-strength-meter");
    var text = $("#password-strength-text");
    var result = zxcvbn(password);
    var crackTimes = result.crack_times_display;

    displayPasswordCrackTimes(crackTimes);

    meter.val(result.score + 1);
    text.html("Strength: " + strength[result.score + 1]);
}

$("#copyPass").click(function () {
    var pass = $("#password").val();

    $("#password").select();
    document.execCommand("copy");

    // Unselect the text
    $("#password").val("");
    $("#password").val(pass);

    // Change the Tooltip text to show copied for 3 seconds then change it back
    var tooltip = document.getElementById("toolTip");
    setTimeout(function () {
        tooltip.innerHTML = "Copy to clipboard";
    }, 3000);
    tooltip.innerHTML = "Copied!";
});

$("#characternum").on("change", function () {
    localStorage["numberOfChars"] = $(this).val();
});

$("#symbols").on("change", function () {
    localStorage["useSymbols"] = $(this).prop("checked");
});

$("#numbers").on("change", function () {
    localStorage["useNums"] = $(this).prop("checked");
});

function displayPasswordCrackTimes(crackTimes){
    var dropdown = $("#crack-times-dropdown");
    var timesContainer = $("#password-crack-times");
    timesContainer.html("");

    dropdown.html("Password Crack Times <i id='crack-times-caret' class='fas fa-caret-down'></i>");

    var title = $("<span />").attr("class", "time-label").html("Offline:");
    var el = $("<span />").attr("class", "time-value").html($("<span />").html("Fast Hashing - 1e10/second: "));
    el.append($("<span />").html(crackTimes["offline_fast_hashing_1e10_per_second"].replace("less than", "<")));
    var el2 = $("<span />").attr("class", "time-value").html($("<span />").html("Slow Hashing - 1e4/second: "));
    el2.append($("<span />").html(crackTimes["offline_slow_hashing_1e4_per_second"].replace("less than", "<")));

    var title2 = $("<span />").attr("class", "time-label margin-top").html("Online:");
    var el3 = $("<span />").attr("class", "time-value").html($("<span />").html("No Throttling - 10/second: "));
    el3.append($("<span />").html(crackTimes["online_no_throttling_10_per_second"]));
    var el4 = $("<span />").attr("class", "time-value").html($("<span />").html("Throttling - 100/second: "));
    el4.append($("<span />").html(crackTimes["online_throttling_100_per_hour"]));

    timesContainer.append(title, el, el2, title2, el3, el4);
}

$("#crack-times-dropdown").click(function() {
    $("#password-crack-times").slideToggle();
    $("#crack-times-caret").toggleClass("fa-caret-down fa-caret-up");
});
// Elements for user input
const nameElement = document.getElementById("name")
const birthdayElement = document.getElementById("birthday")
const reminderElement = document.getElementById("reminder")

// Button elements for saving on popup
const saveBirthdayButton = document.getElementById("saveBirthday")

// Error message
const nameError = document.getElementById("nameError")
const birthdayError = document.getElementById("birthdayError")
const reminderError = document.getElementById("reminderError")

// Showing & Adding elements that would allow users to switch between the two files
const addButton = document.getElementById("addButton")
const showButton = document.getElementById("showButton")

// Function that shows elements when called
const showElement = (element) => {
    element.style.display = '';
}

// Function that hides elements when called
const hideElement = (element) => {
    element.style.display = 'none';
}

const showDateError = (errorElement, errorMessage) => {
    errorElement.innerHTML = errorMessage;
    showElement(errorElement);
}

const birthdayChecker = (today, birthday) => {
    const isAfterToday = birthday.isAfter(today, 'minute')

    if (!birthdayElement.value) {
        showDateError(birthdayError, 'Please select a valid b-day*');
    } else if (!isAfterToday) {
        showDateError(birthdayError, 'The b-day must not be before today*');
    } else {
        hideElement(birthdayError)
    }

    return birthdayElement.value && isAfterToday
}

const reminderChecker = (today, birthday, reminder) => {
    const isAfterToday = reminder.isAfter(today, 'minute');
    const isBeforeBirthday = reminder.isBefore(birthday, 'minute');

    if (!reminderElement.value) {
        showDateError(reminderError, 'Please select a valid reminder date & time*');
    } else if (!isBeforeBirthday) {
        showDateError(reminderError, 'Reminder must be before or on the birthday*');
    } else if (!isAfterToday) {
        showDateError(reminderError, 'Reminder must be at least a minute later than rn*');
    } else {
        hideElement(reminderError);
    }
    
    return reminderElement.value && isAfterToday && isBeforeBirthday;
}


// holds onto the Date & Time
const dateValidation = () => {
    const today = spacetime.now();
    const birthday = spacetime(birthdayElement.value).hour(23).minute(59).second(59);
    const reminder = spacetime(reminderElement.value);
    
    const isBirthdayValid = birthdayChecker(today, birthday);
    const isReminderValid = reminderChecker(today, birthday, reminder);

    return isBirthdayValid && isReminderValid;
}

// Checks if the user inputted a value for each input element
const performErrorChecking = () => {

    const isDateValid= dateValidation();

    if (!nameElement.value) {
        showElement(nameError);
    } else {
        hideElement(nameError);
    }


    return nameElement.value && isDateValid;
}

saveBirthdayButton.onclick = () => {
    const noError = performErrorChecking();

    if (noError){
        const prefs = {};
        prefs[nameElement.value] = {
            name: nameElement.value,
            birthday: birthdayElement.value,
            reminder: reminderElement.value
        }
        chrome.runtime.sendMessage({ event: 'onAddBirthday', prefs});
        alert("Reminder received!");
        nameElement.value = "";
        birthdayElement.value = "";
        reminderElement.value = "";
    }
}
/*
chrome.storage.local.get(["name", "birthday", "reminder"], (result) => {
    const { name, birthday, reminder } = result;

    if (name) {
        nameElement.value = name;
    }

    if (birthday) {
        birthdayElement.value = birthday;
    }

    if (reminder) {
        reminderElement.value = reminder;
    }
})*/

const today = spacetime.now().startOf('day').format();
birthdayElement.setAttribute('min', today);
const todayWithTime = today + 'T00:00'; // if possible, fix the time later
reminderElement.setAttribute('min', todayWithTime);
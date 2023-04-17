console.log('script pakday che');
let REPORT_DATA = []
let ALL_ROWS = []
const RANDOM_NAMES = new Array("Harry", "Peter", "Bruce", "Parker", "Sanjay", "Steve", "Tony", "Thor", "Hawkeye", "Black Widow", "Scott", "Bruce", "Lois", "Nick", "Anos", "Goku", "Kang", "Rogers", "Osborn", "Patterson", "Henry", "Simmons", "Michelle", "Perry", "Frank", "Butler", "Shirley")
const RANDOM_SUBJECTS = ["English", "Math", "Art", "Science", "History", "Music", "Geography"]

const submit = document.querySelector('#submit')
const inputTable = document.querySelector('#inputTable')
const alertSection = document.querySelector('#alertSection')
const addNewRow = document.querySelector('#addNewRow')
const inputTableBody = inputTable.querySelector('#inputTableBody')
const reportSection = document.querySelector('#reportSection')
const search = document.querySelector('#search')
const randomData = document.querySelector('#randomData')
const sort = document.querySelector('#sort')

updateIndex(inputTable)
addButtonColor()
//ADDING NEW  ROWS PART=============================================================================================
addNewRow.addEventListener('click', () => {
    const newRow = document.createElement('tr')

    newRow.innerHTML = `
    <tr>
    <th class="fade-left" scope="row" data-index></th>
    <td class="fade-left">
      <label class="sm-d-block">Name</label>
      <input class="form-control" type="text" name="name" id="" placeholder="Enter Name"
        onblur="checkString(this)" data-name required>
    </td>
    <td class="fade-left">
      <label class="sm-d-block">Subject</label>
      <input class="form-control" type="text" name="subject" id="" placeholder="Enter subject"
        onblur="checkString(this)" data-subject required>
    </td>
    <td class="fade-left">
      <label class="sm-d-block">Marks</label>
      <input class="form-control" type="number" name="marks" id="" placeholder="Enter marks"
        onblur="checkMarks(this)" data-marks onkeypress="onlyNumbers(event)" required>
    </td>
    <td class="fade-left">
      <div class="btn-group" role="group" aria-label="Basic mixed styles example">
        <button type="button" data-result="true" class="btn btn-info selected-result passBtn" onclick="addButtonColor()">Accept</button>
        <button type="button" data-result="false" class="btn failBtn" onclick="addButtonColor()">Reject</button>
      </div>
    </td>
    <td class="text-center fade-left">
      <label class="sm-d-block">Action</label>
      <button type="button" id="remove"class="btn btn-danger" onclick="removeRow(event)">Remove</button> 

    </td>
  </tr>
    `
    inputTableBody.appendChild(newRow)
    updateIndex(inputTable)
    addButtonColor()

})

//ON SUBMIT OF THE INPUTS ============================================================================================================================
submit.addEventListener('click', submitTheData)
function submitTheData() {
    const nameinput = document.querySelectorAll('[data-name]')
    const subjectinput = document.querySelectorAll('[data-subject]')
    const marksinput = document.querySelectorAll('[data-marks]')
    const results = document.querySelectorAll('.selected-result ')
    //check for inputs and give alert
    if (validation(nameinput, subjectinput, marksinput)) {
        REPORT_DATA = []
        //if all inputs are ok then push it in array of json==========================================================================================
        nameinput.forEach((element, index) => {
            const isAccepted = results[index].getAttribute('data-result')
            if (isAccepted == 'true') {
                REPORT_DATA.push(
                    {
                        'id': index + 1,
                        'name': element.value,
                        'subject': subjectinput[index].value,
                        'marks': marksinput[index].value
                    }
                )
            }
        })
        //new table generation and his function
        generateReport(REPORT_DATA)
    }
}



// DLEETING ROWS PART=========================================================================================

function removeRow(e) {
    Swal.fire({
        title: 'Are you sure About That?',
        text: "You Have to Fill The Data Manually Again!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'indigo',
        cancelButtonColor: '#dc3545',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            e.target.parentElement.parentElement.classList.remove('fade-left')
            e.target.parentElement.parentElement.classList.add('fade-right')
            setTimeout(() => {
                e.target.parentElement.parentElement.remove()
                updateIndex(inputTable)
            }, 200)
            if (REPORT_DATA.length > 0) {
                const id = REPORT_DATA.find((item, index) => {
                    const removeId = e.target.parentElement.parentElement.children[0].innerText
                    if (removeId == (index + 1)) { return removeId }
                })
                if (REPORT_DATA.indexOf(id) > -1) { REPORT_DATA.splice(REPORT_DATA.indexOf(id), 1) }
            }
        } else return 
        Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
        ).then((res) => {
            if (res.isConfirmed) {
                const nameinput = document.querySelectorAll('[data-name]')
                const subjectinput = document.querySelectorAll('[data-subject]')
                const marksinput = document.querySelectorAll('[data-marks]')
                if (validation(nameinput, subjectinput, marksinput)) { generateReport(REPORT_DATA) }
            }
        })
    })
}

// VALIDATION AND CHECKINIG PART=========================================================================

function checkString(e) {
    if (hasNumber(e.value) || e.value == '' || e.value == ' ') {
        showBorder(e)
        return false;
    }
    else {
        return true;
    }
}
function checkMarks(e) {
    if (e.value < 0 || e.value > 100 || e.value == '' || e.value == ' ' || e.value.includes('e')) {
        showBorder(e)
        return false;
    }
    else {
        return true;
    }
}

function hasNumber(myString) {
    return /\d/.test(myString);
}
function onlyNumbers(e) {
        if (e.which != 8 && e.which != 0 && e.which < 48 || e.which > 57){e.preventDefault();}
}
function validation(nameinput, subjectinput, marksinput) {
    const stringinput = [nameinput, subjectinput]
    for (let i = 0; i < stringinput.length; i++) {
        const input = stringinput[i];
        for (let i = 0; i < input.length; i++) {
            const element = input[i];
            if (!checkString(element)) {
                showAlert("warning", `Plz fill appropriate data in row no. ${i + 1}`)
                return false;
            }
        }
    }
    for (let i = 0; i < marksinput.length; i++) {
        const element = marksinput[i];
        if (!checkMarks(element)) {
            showAlert("warning", `Plz fill appropriate data in row no. ${i + 1}`)
            return false;
        }
    }
    return true;
}

// GENERATING NEW TABLE PART============================================================

function generateReport(data) {
    reportSection.innerHTML = ''
    if (REPORT_DATA.length > 0) {
        reportSection.innerHTML = `
    <h2 class="my-2">Generated Result</h2>
    <table class="table table-striped shadow bg-info" id="reportTable">
    <thead>
          <tr>
            <th scope="col">No.</th>
            <th scope="col">Name </th>
            <th scope="col">Subject </th>
            <th scope="col">Marks</th>
            <th scope="col">Result</th>
          </tr>
    </thead>
        <tbody id="reportTableBody">
        </tbody>
    </table>
    `
        appendRows(data);
    }
    showPercentageTable(data);
}

//APPENDING NEW ROWS AND DATA TO THE NEW TABLE====================================================================
function appendRows(data) {
    const reportTableBody = reportTable.querySelector('#reportTableBody')

    ALL_ROWS = data.map((element) => {
        const row = document.createElement('tr')
        const td_index = document.createElement('th')
        const td_name = document.createElement('td')
        const td_subject = document.createElement('td')
        const td_marks = document.createElement('td')
        const td_result = document.createElement('td')
        const allTd = [td_index, td_name, td_subject, td_marks, td_result]
        td_index.setAttribute('data-index', '')

        allTd.forEach((td) => {
            td.classList.add('fade-left');
            row.appendChild(td);
        })

        td_name.innerText = element.name
        td_subject.innerText = element.subject
        td_marks.innerText = element.marks

        if (element.marks > 33) {
            td_result.innerText = "Pass";
        }
        else {
            td_result.innerText = "Fail";
            td_result.parentElement.classList.add('bg-danger')
            allTd.forEach((td) => {
                td.classList.add('text-light');
            })
        }
        reportTableBody.appendChild(row)
        return {
            names: element.name,
            subject: element.subject,
            result: td_result.innerText,
            row: row
        }
    })
    updateIndex(reportTable);

}
//PERCANTAGE TABLE===========================================================================================================
function showPercentageTable(data) {
    const percentageTableContainer = document.querySelector('#percentageTableContainer');
    percentageTableContainer.innerHTML = ``
    if (data.length > 0) {
        const onlynames = data.map((item) => {
            return item.name.toLowerCase();
        })
        // creating array of unique names=================================

        let uniquenames = new Set(onlynames);
        let duplicateElements = {};
        onlynames.forEach(name => duplicateElements[name] = (duplicateElements[name] || 0) + 1);

        percentageTableContainer.innerHTML = `
        <h1 class="mt-5">Percantages</h1>
        <table class="table bg-indigo " id="percentageTable">
            <thead>
                <tr>
                <th scope="col">No.</th>
                <th scope="col">Name</th>
                <th scope="col">Percantage</th>
                <th scope="col">Result</th>
                </tr>
            </thead>
            <tbody id="percentageTableBody">
            </tbody>
        </table>
        `
        const percentageTable = document.querySelector("#percentageTable");
        const percentageTableBody = percentageTable.querySelector("#percentageTableBody");
        percentageTableBody.innerHTML = ``;
        const fetchMarks = Array.from(uniquenames).map(uniquename => {
            return data.map((item) => {
                if (item.name.toLowerCase() == uniquename.toLowerCase()) {
                    return parseInt(item.marks);
                }
                else {
                    return 0;
                }
            })
        })
        const marksAccordingToName = fetchMarks.map((mark) => {
            return mark.reduce((a, b) => {
                return a + b;
            })
        })
        Array.from(uniquenames).forEach((name, index) => {
            let row = percentageTableBody.insertRow(percentageTableBody.rows.length)
            data_index = document.createElement('th')
            row.appendChild(data_index)
            data_index.setAttribute('data-index', '')
            data_index.setAttribute('class', 'fade-left')

            let user_name = row.insertCell(1)
            user_name.classList.add('fade-left')
            let user_percentage = row.insertCell(2)
            user_percentage.classList.add('fade-left')
            let results = row.insertCell(3)
            results.classList.add('fade-left')

            user_name.innerText = capitalizeEachWord(name)
            let percentage = (marksAccordingToName[index] / (duplicateElements[name]))
            user_percentage.innerText = percentage.toFixed(2)
            if (percentage < 33) {
                row.classList.add('bg-danger')
                results.innerText = "Fail"
            }
            else {
                results.innerText = "Pass"
            }
        })
        updateIndex(percentageTable)
    }

}

// SEARCHING FUNCTION=====================================================================================================
search.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase()
    if (query == '' || query == ' ') {
        generateReport(REPORT_DATA)
    }
    ALL_ROWS.forEach((row) => {
        const isThere = row.names.toLowerCase().includes(query) ||
            row.subject.toLowerCase().includes(query) ||
            row.result.toLowerCase().includes(query)
        row.row.classList.toggle('d-none', !isThere)
    })
})

// ADDING RANDOM VALUES==============================================================================

randomData.addEventListener('click', () => {
    const nameinput = document.querySelectorAll('[data-name]')
    const subjectinput = document.querySelectorAll('[data-subject]')
    const marksinput = document.querySelectorAll('[data-marks]')

    Array.from(nameinput).map((input, index) => {
        input.value = getRandomItem(RANDOM_NAMES)
        subjectinput[index].value = getRandomItem(RANDOM_SUBJECTS)
        marksinput[index].value = getRandomValues(100)
    })
})

//FUNCTION FOR SORTING ===========================================================================================
sort.addEventListener('change', (e) => {
    let catagory = e.target.value
    if (REPORT_DATA.length < 1) {
        return
    }
    switch (catagory) {
        case "name":
            const sortByName = REPORT_DATA.sort((a, b) => { if (a.name < b.name) { return -1 } })
            generateReport(sortByName)
            break;

        case "subject":

            const sortBySubject = REPORT_DATA.sort((a, b) => { if (a.subject < b.subject) { return -1 } })
            generateReport(sortBySubject)
            break;
        case "none":
            const sortById = REPORT_DATA.sort((a, b) => { if (a.id < b.id) { return -1 } })
            generateReport(sortById)
            break;
    }
})

// EXTRA FUNCTIONS=============================================

// updating the index of table
function updateIndex(table) {
    const indexCol = table.querySelectorAll('[data-index]')
    indexCol.forEach((element, index) => {
        element.innerText = index + 1
    });
}

//Show the border
function showBorder(ele) {
    ele.classList.add('bg-danger')
    ele.classList.add('placeholder-color')
    ele.focus()
    setTimeout(() => {
        ele.classList.remove('bg-danger')
        ele.classList.remove('placeholder-color')
    }, 2000)
}
//Button  functions
function addButtonColor() {
    const passBtns = document.querySelectorAll('.passBtn')
    const failBtns = document.querySelectorAll('.failBtn')
    passBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            btn.setAttribute('class', 'btn btn-info selected-result passBtn')
            btn.nextElementSibling.classList.remove('btn-danger')
            btn.nextElementSibling.classList.remove('selected-result')
        })
    })
    failBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            btn.setAttribute('class', 'btn btn-danger selected-result failBtn')
            btn.previousElementSibling.classList.remove('btn-info')
            btn.previousElementSibling.classList.remove('selected-result')

        })
    })
}

//capitals the each word
function capitalizeEachWord(string) {
    const splittedString = string.split(" ");
    for (let i = 0; i < splittedString.length; i++) {
        splittedString[i] = splittedString[i].charAt(0).toUpperCase() + splittedString[i].slice(1);
    }
    return splittedString.join(" ");
}

// get a random item from an array

function getRandomItem(arr) {
    return arr[getRandomValues(arr.length)]
}

// random values================
function getRandomValues(range) {
    return Math.floor(Math.random() * range);
}
// Alert function
function showAlert(className, message) {
    alertSection.innerHTML = `
    <div class="alert alert-${className} alert-dismissible fade-left" id="alert" role="alert">
            <strong>${message}</strong> 
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `
    const alert = document.querySelector('#alert')
    alert.classList.add('show')

    setTimeout(() => {
        alert.classList.remove('fade-left')
        alert.classList.add('fade-right')
        setInterval(() => {
            alert.classList.add('d-none')
        }, 200)
    }, 1500);
}
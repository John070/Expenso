document
  .getElementsByClassName("list-type")[0]
  .addEventListener("click", function (event) {
    var clickedList = event.target.id;
    var inc = document.getElementsByClassName("income-list")[0];
    var exp = document.getElementsByClassName("expense-list")[0];
    var incHeader = document.getElementById("list-type-income");
    var expHeader = document.getElementById("list-type-expense");
    inc.style.display = "none";
    exp.style.display = "none";
    if (clickedList === "list-type-income") {
      inc.style.display = "inline";
      incHeader.classList.add("activeList");
      incHeader.classList.remove("list-type-style");
      expHeader.classList.remove("activeList");
      expHeader.classList.add("list-type-style");
    } else {
      exp.style.display = "inline";
      expHeader.classList.add("activeList");
      expHeader.classList.remove("list-type-style");
      incHeader.classList.remove("activeList");
      incHeader.classList.add("list-type-style");
    }
  });

var dataController = (function () {
  //to-do
  var budgetData = {
    inc: [],
    exp: [],
    totalInc: 0,
    totalExp: 0,
  };

  var Income = function (ID, description, value) {
    this.ID = ID;
    this.description = description;
    this.value = value;
  };

  var Expense = function (ID, description, value) {
    this.ID = ID;
    this.description = description;
    this.value = value;
  };

  return {
    addItem: function (type, desc, val) {
      var id;
      var newItem;
      if (budgetData[type].length === 0) id = 1;
      else id = budgetData[type][budgetData[type].length - 1].ID + 1;
      if (type === "inc") {
        newItem = new Income(id, desc, val);
        budgetData.totalInc += val;
      } else {
        newItem = new Expense(id, desc, val);
        budgetData.totalExp += val;
      }
      budgetData[type].push(newItem);
      return newItem;
    },
    deleteItem: function (itemDeleted) {
      var itemDetails, type, ID, position;
      // console.log(itemClass);
      itemDetails = itemDeleted.split("-");
      console.log(itemDetails);
      type = itemDetails[0];
      ID = parseInt(itemDetails[1]);
      console.log("here id", budgetData[type][0].ID);
      // console.log("here", type, ID);
      for (var i = 0; i < budgetData[type].length; i++) {
        if (budgetData[type][i].ID === ID) {
          position = i;
          console.log("came");
          break;
        }
      }
      console.log(position);
      if (type === "inc") {
        budgetData.totalInc -= budgetData["inc"][position].value;
      } else {
        budgetData.totalExp -= budgetData["exp"][position].value;
      }
      budgetData[type].splice(position, 1);
    },
    getTotal: function () {
      return {
        inc: budgetData.totalInc,
        exp: budgetData.totalExp,
      };
    },
    testOp: function (type, desc, val) {
      console.log(budgetData);
    },
  };
})();
var uiController = (function () {
  var DOMStrings = {
    type: ".add__type",
    description: "#desc",
    value: "#value",
    addBtn: "#add-btn",
    incList: ".income-list",
    expList: ".expense-list",
    incomeTotal: ".total-income",
    expenseTotal: ".total-expense",
    availableBudget: ".budget-available",
    deleteItem: ".list",
  };
  var pieChart;
  var chartData;
  return {
    getInput: function () {
      var type, desc, val;
      type = document.querySelector(DOMStrings.type).value;
      desc = document.querySelector(DOMStrings.description).value;
      val = parseInt(document.querySelector(DOMStrings.value).value);
      return {
        type: type,
        desc: desc,
        val: val,
      };
    },
    getDomStrings: function () {
      return DOMStrings;
    },
    addItem: function (newItem, type) {
      var id, desc, val, table;
      id = newItem.ID;
      desc = newItem.description;
      val = newItem.value;
      htmlString =
        '<div class="item clearfix" id="$$$$-' +
        id +
        '"><div class="item-desc">' +
        desc +
        '</div><div class="item-value">' +
        val +
        '<span class="delete-btn"><i class="fas fa-trash"></span></div></div>';
      if (type === "inc") {
        htmlString = htmlString.replace("$$$$", "inc");
        table = document.querySelector(DOMStrings.incList);
      } else {
        htmlString = htmlString.replace("$$$$", "exp");
        table = document.querySelector(DOMStrings.expList);
      }
      table.insertAdjacentHTML("beforeend", htmlString);
    },
    updateTotal: function (totalBudget) {
      var inc, exp;
      inc = totalBudget.inc;
      exp = totalBudget.exp;
      console.log(inc, exp);
      // this.setChart([inc, exp]);
      document.querySelector(DOMStrings.availableBudget).textContent =
        inc - exp;
      document.querySelector(DOMStrings.incomeTotal).textContent = inc;
      document.querySelector(DOMStrings.expenseTotal).textContent = exp;
      chartData[0] = inc;
      chartData[1] = exp;
      pieChart.update();
    },
    deleteItem: function (target) {
      var elementToDelete, itemDeleted;
      elementToDelete = target.parentNode.parentNode.parentNode;
      itemDeleted = elementToDelete.id;
      console.log(itemDeleted);
      elementToDelete.parentNode.removeChild(elementToDelete);
      return itemDeleted;
    },

    setChart: function (data) {
      var ctx = document.getElementById("myChart").getContext("2d");
      var data = {
        labels: ["Income", "Expense"],
        datasets: [
          {
            data: data,
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
            ],
            borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
            borderWidth: 1,
          },
        ],
      };

      var options = {
        legend: {
          display: false,
        },
      };
      pieChart = new Chart(ctx, {
        type: "doughnut",
        data: data,
        options: options,
      });
      chartData = pieChart.config.data.datasets[0].data;
    },
  };
})();

var appController = (function (dataCtrl, uiCtrl) {
  //1. Add a new item
  var addItem = function () {
    var inputData, newItem, totalBudget;
    //Get data from Ui
    inputData = uiCtrl.getInput();
    newItem = dataCtrl.addItem(inputData.type, inputData.desc, inputData.val);
    uiCtrl.addItem(newItem, inputData.type);
    totalBudget = dataCtrl.getTotal();
    // console.log(totalBudget);
    uiCtrl.updateTotal(totalBudget);

    // dataCtrl.testOp();
  };

  var deleteItem = function (event) {
    var deletedElement, totalBudget;
    if (event.target.parentNode.parentNode.parentNode.id) {
      deletedElement = uiCtrl.deleteItem(event.target);
      dataCtrl.deleteItem(deletedElement);
      totalBudget = dataCtrl.getTotal();
      uiCtrl.updateTotal(totalBudget);
    }
  };

  var setupDate = function () {
    var date, day, monthArr, month, year, displayDate;
    monthArr = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "June",
      "July",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ];
    date = new Date();
    day = date.getDate();
    month = monthArr[date.getMonth()];
    year = date.getFullYear();
    displayDate = month + " " + day + ", " + year;
    document.querySelector(".date-today").textContent = displayDate;
  };

  var setUpEventListeners = function () {
    var DomStrings;
    DomStrings = uiCtrl.getDomStrings();
    document
      .querySelector(DomStrings.addBtn)
      .addEventListener("click", addItem);
    document
      .querySelector(DomStrings.deleteItem)
      .addEventListener("click", deleteItem);
  };
  return {
    init: function () {
      setupDate();
      setUpEventListeners();
      uiCtrl.setChart([50, 50]);
    },
  };
})(dataController, uiController);

appController.init();

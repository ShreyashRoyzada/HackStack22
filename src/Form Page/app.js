
App = {
  loading: false,
  contracts: {},

  load: async () => {
    await App.loadWeb3()
    await App.loadAccount()
    await App.loadContract()
    await App.render()
  },

  // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
  loadWeb3: async () => {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {
      window.alert("Please connect to Metamask.")
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum)
      try {
        // Request account access if needed
        await ethereum.enable()
        // Acccounts now exposed
        web3.eth.sendTransaction({/* ... */ })
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
      // Acccounts always exposed
      web3.eth.sendTransaction({/* ... */ })
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  },

  loadAccount: async () => {
    // Set the current blockchain account
    web3.eth.defaultAccount = web3.eth.accounts[0]
  },

  loadContract: async () => {
    // Create a JavaScript version of the smart contract
    const todoList = await $.getJSON('../TodoList.json')
    App.contracts.TodoList = TruffleContract(todoList)
    App.contracts.TodoList.setProvider(App.web3Provider)

    // Hydrate the smart contract with values from the blockchain
    App.todoList = await App.contracts.TodoList.deployed()
  },

  render: async () => {
    // Prevent double render
    if (App.loading) {
      return
    }

    // Update app loading state
    App.setLoading(true)

    // Render Account
    $('#account').html(web3.eth.defaultAccount)

    // Render Tasks
    //await App.renderTasks()

    // Update loading state
    App.setLoading(false)
  },

  renderTasks: async () => {
    // Load the total task count from the blockchain
    const taskCount = await App.todoList.taskCount()
    const $taskTemplate = $('.taskTemplate')

    // Render out each task with a new task template
    for (var i = 1; i <= taskCount; i++) {
      // Fetch the task data from the blockchain
      const task = await App.todoList.tasks(i)
      const taskId = task[0].toNumber()
      const name = task[1]
      const father = task[2]
      const mother = task[3]
      const bloodg = task[4]

      const age = task[5].toNumber()
      const weight = task[6].toNumber()
      const height = task[7].toNumber()

      const phone = task[8]
      const gender = task[9]

      // Create the html for the task
      const $newTaskTemplate = $taskTemplate.clone()
      $newTaskTemplate.find('.taskId').html(taskId)
      $newTaskTemplate.find('.contentname').html(name)
      $newTaskTemplate.find('.contentfather').html(father)
      $newTaskTemplate.find('input')
        .prop('name', taskId)
        .prop('checked', true)
        .on('click', App.toggleCompleted)

      //Put the task in the correct list
     
        markup = "<tr>" + 
          "<td>" + taskId + "</td>" +
          "<td>" + name + "</td>" +
          "<td>" + father + "</td>" +
          "<td>" + mother + "</td>" +
          "<td>" + bloodg + "</td>" +
          "<td>" + age + "</td>" +
          "<td>" + weight + "</td>" +
          "<td>" + height + "</td>" +
          "<td>" + phone + "</td>" +
          "<td>" + gender + "</td>" +
          + "</tr>";
        tableBody = $("table tbody");
        tableBody.append(markup);
        //$('#taskList').append($newTaskTemplate)
      

      // Show the task
      $newTaskTemplate.show()
    }
  },

  retrive: async () => {
    const retid = $('#retId').val()
    await App.renderID(retid)
  },

  renderID: async (retid) => {
    // App.setLoading(true)
    await App.todoList.retTask(retid)
    
    const task = await App.todoList.tasks(retid)
      const taskId = task[0].toNumber()
      const name = task[1]
      const father = task[2]
      const mother = task[3]
      const bloodg = task[4]

      const age = task[5].toNumber()
      const weight = task[6].toNumber()
      const height = task[7].toNumber()

      const phone = task[8]
      const gender = task[9]

    markup = "<tr>" + 
          "<td>" + taskId + "</td>" +
          "<td>" + name + "</td>" +
          "<td>" + father + "</td>" +
          "<td>" + mother + "</td>" +
          "<td>" + bloodg + "</td>" +
          "<td>" + age + "</td>" +
          "<td>" + weight + "</td>" +
          "<td>" + height + "</td>" +
          "<td>" + phone + "</td>" +
          "<td>" + gender + "</td>" +
          + "</tr>";
        tableBody = $("table tbody");
        tableBody.append(markup);
        
  },  

  createName: async () => {
    App.setLoading(true)
    const name = $('#name').val()
    const father = $('#father').val()
    const mother = $('#mother').val()
    const bloodg = $('#bloodg').val()

    const age = $('#age').val()
    const weight = $('#weight').val()
    const height = $('#height').val()
    const phone = $('#phone').val()

    const gender = $('#gender').val()
    
    await App.todoList.createTask(name, father, mother, bloodg, age, weight, height,phone, gender)
    window.location.reload()
  },

  toggleCompleted: async (e) => {
    App.setLoading(true)
    const taskId = e.target.name
    await App.todoList.toggleCompleted(taskId)
    window.location.reload()
  },

  setLoading: (boolean) => {
    App.loading = boolean
    const loader = $('#loader')
    const content = $('#content')
    if (boolean) {
      loader.show()
      content.hide()
    } else {
      loader.hide()
      content.show()
    }
  }
}

$(() => {
  $(window).load(() => {
    App.load()
  })
})

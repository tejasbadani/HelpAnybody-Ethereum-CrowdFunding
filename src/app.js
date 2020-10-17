App = {
  loading: false,
  contracts: {},
  mainState: 0,
  globalIndex: 0,
  globalAdmin: 0,
  adminIndex: 0,
  
  
  //0=main, 1=procCreate, 2=Mod, 3=Donor
    // main 3 choice                       1


    // loading: false,					          101
    // createProjectState: false,				  102
    // viewMyProjectsState: false,			  103
    // viewAllProjectsState: false,				104
    // viewAllAdmins: false,				      105
    // withdrawFromProjectState: false,		106
    // viewAllTransactionState: false,		107
    // submitProofState: false,				    108
    // viewReputationState: false,				109
    // homeState: false,					        110

    // validateTransaction                201
    //          Accept/Reject a transaction
    //          Goto ProjCreate and get transaction and feed it to a func
    //          all other func ... figure it out
    // viewModeratorToken                 202
    // modHomePage                        203

    // donorViewAllProjects               301 == reuse 104
    // donateToProject                    302
    // viewAllTransaction                 303 == reuse 107
    // viewAllAdmin                       304 == reuse 105
    // donorHomePage                      305









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
      window.alert('Please connect to Metamask.')
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum)
      try {
        // Request account access if needed
        await ethereum.enable()
        // Acccounts now exposed
        web3.eth.sendTransaction({
          /* ... */
        })
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
      // Acccounts always exposed
      web3.eth.sendTransaction({
        /* ... */
      })
    }
    // Non-dapp browsers...
    else {
      console.log(
        'Non-Ethereum browser detected. You should consider trying MetaMask!',
      )
    }
  },

  loadAccount: async () => {
    // Set the current blockchain account
    App.account = web3.eth.accounts[0]
  },

  loadContract: async () => {
    // Create a JavaScript version of the smart contract
    const PC = await $.getJSON('ProjectCreator.json')
    App.contracts.PC = TruffleContract(PC)
    App.contracts.PC.setProvider(App.web3Provider)

    const M = await $.getJSON('Moderator.json')
    App.contracts.M = TruffleContract(M)
    App.contracts.M.setProvider(App.web3Provider)

    const D = await $.getJSON('Donor.json')
    App.contracts.D = TruffleContract(D)
    App.contracts.D.setProvider(App.web3Provider)

    // Hydrate the smart contract with values from the blockchain
    App.PC = await App.contracts.PC.deployed()
    App.M = await App.contracts.M.deployed()
    App.D = await App.contracts.D.deployed()
  },










  render: async () => {
    // Prevent double render
    if (App.loading) {
      return
    }

    // Update app loading state
    App.setLoading(1)

    // Render Account
    $('#account').html(App.account)


    //Render All ProjectCreator
    await App.renderMyProjects()

    //Render All Moderator

    //Render All Donor

    // Update loading state
    if(App.mainState === 0){
      App.setLoading(1)
    }
    else if(App.mainState === 1){
      App.setLoading(110)
    }
    else if(App.mainState === 2){
      App.setLoading(203)
    }
    else if(App.mainState === 3){
      App.setLoading(305)
    }
  },











// MAIN PAGE FUNCTIONS
SET_PROJECT_CREATOR: async () => {
  console.log('selected SET_PROJ_CREATOR')
  App.mainState = 1
  App.setLoading(110)
  //window.location.reload()
},
SET_MODERATOR: async () => {
  console.log('selected SET_MOD')
  App.mainState = 2
  App.setLoading(203)
},
SET_DONOR: async () => {
  console.log('selected SET_DONOR')
  App.mainState = 3
  App.setLoading(304)
},
// END OF MAIN PAGE FUNCTIONS
















// PROJECT CREATOR FUNCTIONS

  findAdminIndexWithOverallIndex: async () => {

  },


  renderAllProjects: async () => {
    // Load the total task count from the blockchain
    const PCCount = await App.PC.pCount()
    const $allProjectsTemplate = $('.allProjectsTemplate')

    // Render out each task with a new task template
    for (var i = 0; i < PCCount; i++) {
      // Fetch the task data from the blockchain
      const proj = await App.PC.projectList(i)
      const name = proj[0]
      const desc = proj[1]
      const limit = proj[2].toNumber()
      const admin = proj[3]
      const donatedVal = proj[4].toNumber()
      const bal = proj[5].toNumber()

      // Create the html for the task
      const $newAllProjectsTemplate = $allProjectsTemplate.clone()
      $newAllProjectsTemplate.find('.pName').html(name)
      $newAllProjectsTemplate.find('.pDesc').html(desc)
      $newAllProjectsTemplate.find('.pLimit').html(limit)
      $newAllProjectsTemplate.find('.pAdmin').html(admin)

      $('#allProjects').append($newAllProjectsTemplate)

      $newAllProjectsTemplate.show()
    }
  },

  renderMyProjects: async () => {
    // Load the total task count from the blockchain
    const PCCount = await App.PC.pCount()
    const $myProjectsTemplate = $('.myProjectsTemplate')

    // Render out each task with a new task template
    for (var i = 0; i < PCCount; i++) {
      // Fetch the task data from the blockchain
      const proj = await App.PC.projectList(i)
      console.log(proj)
      const name = proj[0]
      const desc = proj[1]
      const limit = proj[2].toNumber()
      const admin = proj[3]
      const donatedVal = proj[4].toNumber()
      const bal = proj[5].toNumber()
      if (admin === App.account) {
        // Create the html for the task
        const $newMyProjectsTemplate = $myProjectsTemplate.clone()
        $newMyProjectsTemplate.find('.pName').html(name)
        $newMyProjectsTemplate.find('.pDesc').html(desc)
        $newMyProjectsTemplate.find('.pLimit').html(limit)
        $newMyProjectsTemplate.find('.pAdmin').html(admin)
        $newMyProjectsTemplate.find('.pDonatedVal').html(donatedVal)
        $newMyProjectsTemplate.find('.pBal').html(bal)

        $('#myProjects').append($newMyProjectsTemplate)

        $newMyProjectsTemplate.show()
      }
    }
  },

  createProject: async () => {
    App.setLoading(110)
    const name = $('#name').val()
    const desc = $('#desc').val()
    const limit = $('#limit').val()
    await App.PC.createProject(name, desc, limit)
    window.location.reload()
  },

  withdrawNow: async () => {
    const ID = $('#projID').val()
    const amount = $('#amount').val()
    const reason = $('#Reason').val()
    await App.PC.withdrawNow(amount,ID,reason)
  },

  goToCreate: async () => {
    console.log('selected goToCreate')
    App.setLoading(102)
  },

  goToViewMyProjects: async () => {
    console.log('selected gotToViewMyProjects')
    App.setLoading(103)
  },

  goToViewAllProjects: async () => {
    console.log('selected goToViewAllProjects')
    App.setLoading(104)
  },

  goToViewAllAdmins: async () => {
    console.log('selected goToViewAllAdmins')
    App.setLoading(105)
  },

  goToWithdraw: async () => {
    console.log('selected goToWithdraw')
    App.setLoading(106)
  },

  goToViewTransactions: async () => {
    console.log('selected goToViewTransactions')
    App.setLoading(107)
  },

  goToSubmitProof: async () => {
    console.log('selected goTosubmitProof')
    App.setLoading(108)
  },

  goToViewRepTokens: async () => {
    console.log('selected goToViewRepTokens')
    App.setLoading(109)
  },

  goToHome: async () => {
    console.log('selected goToHome')
    App.setLoading(110)
  },
  // END OF PROJECT CREATOR FUNCTIONS















  // MODERATOR FUNCTIONS
  goToModHome: async () => {
    console.log('selected goToModHome')
    App.setLoading(203)
  },

  goToValidateTransaction: async () => {
    console.log('selected goToValidateTransaction')
    App.setLoading(201)
  },

  goToViewModTokens: async () => {
    console.log('selected goToModTok')
    App.setLoading(202)
  },
  // END OF MOD FUNCS














  // DONOR FUNCS
  goToDonorHome: async () => {
    console.log('selected goToDonorHome')
    App.setLoading(305)
  },

  goToDonate: async () => {
    console.log('selected goToDonate')
    App.setLoading(302)
  },

  goToViewAllProjectsDonor: async () => {
    console.log('selected goToViewAllProjectsD')
    App.setLoading(301)
  },

  goToViewAllAdminsDonor: async () => {
    console.log('selected goToViewAllAdminsD')
    App.setLoading(304)
  },

  goToViewTransactionsDonor: async () => {
    console.log('selected goToViewTransactionsD')
    App.setLoading(303)
  },
  // END OF DONOR FUNCS
















  setLoading: (stateNum) => {
    if(App.mainState === 0){
      document.getElementById('MAIN-PAGE').hidden = false
      document.getElementById('PROJECT-CREATOR').hidden = true
      document.getElementById('MODERATOR').hidden = true
      document.getElementById('DONOR').hidden = true
    }
    else if(App.mainState === 1){
      document.getElementById('MAIN-PAGE').hidden = true
      document.getElementById('PROJECT-CREATOR').hidden = false
      document.getElementById('MODERATOR').hidden = true
      document.getElementById('DONOR').hidden = true

      document.getElementById('loader').hidden = true
      document.getElementById('createProjectHTML').hidden = true
      document.getElementById('viewMyProjectsHTML').hidden = true
      document.getElementById('viewAllProjectsHTML').hidden = true
      document.getElementById('viewAllAdminsHTML').hidden = true
      document.getElementById('withdrawFromProjectHTML').hidden = true
      document.getElementById('viewAllTransactionsHTML').hidden = true
      document.getElementById('submitProofHTML').hidden = true
      document.getElementById('viewReputationHTML').hidden = true
      document.getElementById('homeHTML').hidden = true

      if (stateNum == 101) {
        document.getElementById('loader').hidden = false
        App.loading = true
      } else if (stateNum == 102) {
        document.getElementById('createProjectHTML').hidden = false
      } else if (stateNum == 103) {
        document.getElementById('viewMyProjectsHTML').hidden = false
      } else if (stateNum == 104) {
        document.getElementById('viewAllProjectsHTML').hidden = false
      } else if (stateNum == 105) {
        document.getElementById('viewAllAdminsHTML').hidden = false
      } else if (stateNum == 106) {
        document.getElementById('withdrawFromProjectHTML').hidden = false
      } else if (stateNum == 107) {
        document.getElementById('viewAllTransactionsHTML').hidden = false
      } else if (stateNum == 108) {
        document.getElementById('submitProofHTML').hidden = false
      } else if (stateNum == 109) {
        document.getElementById('viewReputationHTML').hidden = false
      } else if (stateNum == 110) {
        document.getElementById('homeHTML').hidden = false
      }
    }
    else if(App.mainState === 2){
      document.getElementById('MAIN-PAGE').hidden = true
      document.getElementById('PROJECT-CREATOR').hidden = true
      document.getElementById('MODERATOR').hidden = false
      document.getElementById('DONOR').hidden = true
      
      document.getElementById('modHomeHTML').hidden = true
      document.getElementById('validateTransactionHTML').hidden = true
      document.getElementById('viewModTokenHTML').hidden = true

      if(stateNum === 201){
        document.getElementById('validateTransactionHTML').hidden = false
      } else if(stateNum === 202){
        document.getElementById('viewModTokenHTML').hidden = false
      } else{
        document.getElementById('modHomeHTML').hidden = false
      }
    }
    else if(App.mainState === 3){
      document.getElementById('MAIN-PAGE').hidden = true
      document.getElementById('PROJECT-CREATOR').hidden = true
      document.getElementById('MODERATOR').hidden = true
      document.getElementById('DONOR').hidden = false
      
      document.getElementById('viewAllProjectDonorHTML').hidden = true
      document.getElementById('donateHTML').hidden = true
      document.getElementById('viewAllTransactionsDonorHTML').hidden = true
      document.getElementById('viewAllAdminsDonorHTML').hidden = true
      document.getElementById('donorHomeHTML').hidden = true

      if (stateNum == 301) {
        document.getElementById('viewAllProjectDonorHTML').hidden = false
      } else if (stateNum == 302) {
        document.getElementById('donateHTML').hidden = false
      } else if (stateNum == 303) {
        document.getElementById('viewAllTransactionsDonorHTML').hidden = false
      } else if (stateNum == 304) {
        document.getElementById('viewAllAdminsDonorHTML').hidden = false
      } else {
        document.getElementById('donorHomeHTML').hidden = false
      }
    }

  },
}

$(() => {
  $(window).load(() => {
    App.load()
  })
})

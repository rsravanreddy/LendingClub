App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    /*
     * Replace me...
     */
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fall back to Ganache
      App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    /*
     * Replace me...
     */

    $.getJSON('Chits.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var ChitsArtifact = data;
      App.contracts.Chits = TruffleContract(ChitsArtifact);
    
      // Set the provider for our contract
      App.contracts.Chits.setProvider(App.web3Provider);
    
      return App.getPools();
    });
    return App.bindEvents();


  },

  bindEvents: function() {
    $(document).on('click', '.create-pool-btn', App.createPool);
  },

  populatePool: function(poolId){
    
    var chitsInstance;
  
    App.contracts.Chits.deployed().then(function(instance) {
      chitsInstance = instance;
      return chitsInstance.getPool.call(poolId);

    }).then(function(pool) {
      //uint mc,uint ml,uint mf,uint duration,uint sm
        var mc =pool[0].toNumber();  
        var ml =pool[1].toNumber();  
        var mf =pool[2].toNumber();  
        var duration =pool[3].toNumber();  
        var sm =pool[4].toNumber();  

        //console.log(res1);
        //poolTemplate.find('.pool-max-funds"').attr('data-id', data[i].id);
        var poolTemplate = $('#poolTemplate');
        var poolsRow = $('#poolsRow');
        poolTemplate.find('.pool-max-funds').text(mf);
        poolTemplate.find('.pool-max-loan').text(ml);
        poolTemplate.find('.pool-max-contribs').text(mc);
        poolTemplate.find('.pool-max-duration').text(duration);
        poolTemplate.find('.pool-stake-amount').text(sm);
        poolsRow.append(poolTemplate.html());
    }).catch(function(err) {
      console.log(err.message);
    });
   },

  getPools: function() {
    /*
     * Replace me...
     */
    var chitsInstance;

    App.contracts.Chits.deployed().then(function(instance) {
      chitsInstance = instance;

      return chitsInstance.getPools.call();
    }).then(function(noPools) {
        console.log(noPools.toNumber());
        for(var i=noPools.toNumber();i>0;i--)
        {
          App.populatePool(i);

        }
    }).catch(function(err) {
      console.log(err.message);
    });
  } ,



  createPool: function(event) {
    event.preventDefault();

    var ml = $('#ml').val();
    var mc = $('#mc').val();
    var md = $('#md').val();
    var mf = $('#mf').val();
    var sm = $('#sm').val();



    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Chits.deployed().then(function(instance) {
        ChitsInstance = instance;

        return ChitsInstance.newPool( mc, ml, mf, md, sm, {from: account});
      }).then(function(result) {
        return App.getPools();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
    /*
     * Replace me...
     */
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});

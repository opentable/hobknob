map = function(viewmodel){    
  
  var domainConfiguration = [];
  
  for(var index=0; index < viewmodel.domainPrefix.length; index++) {
    domainConfiguration.push({
        domainName: {
          domainName: viewmodel.domainName[index],
          domainPrefix: viewmodel.domainPrefix[index],
          domainId: viewmodel.domainId[index]
        },
        featuredEnabled: (viewmodel.featuredEnabled.indexOf(viewmodel.domainName[index]) > -1) ? true : false,
        lastToggleActivity: viewmodel.lastToggleActivity[index],
        lastToggleUser: viewmodel.lastToggleUser[index],
        abRate: viewmodel.abRate[index]
      });
  }

  return {
    _id: viewmodel.id,
    domainConfiguration: { domainConfiguration: domainConfiguration }
  };
};

module.exports = {
    map: map
};
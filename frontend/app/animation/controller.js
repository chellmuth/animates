import Ember from 'ember';

export default Ember.Controller.extend({
  pngURL: null,

  actions: {
    dataGenerated: function(pngURL) {
      this.set('pngURL', pngURL);
    }
  },
});

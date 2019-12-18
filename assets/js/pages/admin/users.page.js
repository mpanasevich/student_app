parasails.registerPage('users', {

  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    editableItemsMap: {},
    newItemData: {},
    modelName: 'user',
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function () {
    // Attach any initial data from the server.
    _.extend(this, SAILS_LOCALS);
  },
  mounted: async function () {
    //…
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    checkIsEditable: function (id) {
      return Boolean(this.editableItemsMap[id]);
    },
    onEdit: function (itemData) {
      this.editableItemsMap = Object.assign({}, this.editableItemsMap, {[itemData.id]: itemData});
    },
    onCancel: function (id) {
      if (id) {
        delete this.editableItemsMap[id];
        this.editableItemsMap = Object.assign({}, this.editableItemsMap);
      } else {
        this.isAddNew = false;
      }
    },
    remove: function (id) {
      return fetch(`${location.origin}/api/v1/${this.modelName}/${id}`, {
        method: 'DELETE'
      }).then(data => window.location.reload())
    },
    update: function (id) {

      return fetch(`${location.origin}/api/v1/${this.modelName}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(this.editableItemsMap[id]),
      }).then(data => {
        delete this.editableItemsMap[id];
        window.location.reload();
      })
    }
  }
});

parasails.registerPage('users', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    modelName: 'user',
    modal: '',
    formData: {},
    formErrors: {},
    cloudError: '',
    modalTitle: '',
    isNewPlace: false,
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
      delete itemData.createdAt;
      delete itemData.updatedAt;
      this.formData = Object.assign({}, itemData);
      this.isNewPlace = !Boolean(itemData.businessPlace);
      this.modal = 'edit-modal';
      this.modalTitle = itemData.fullName;
      this.formErrors = {};
    },
    onCancel: function () {
      this.formData = {};
      this.closeExampleModal();
    },
    remove: function (id) {
      return fetch(`${location.origin}/api/v1/${this.modelName}/${id}`, {
        method: 'DELETE'
      }).then(data => window.location.reload())
    },

    formSubmit: async function (e) {
      e.preventDefault();
      this.handleParsingForm();

      if (Object.keys(this.formErrors).length > 0) return false;
      else {
        this.cloudError = null;
        const formData = Object.assign({}, this.formData);

        formData.role = formData.role ? formData.role.id : null;
        formData.group = formData.group ? formData.group.id : null;
        formData.businessPlace = formData.businessPlace ? formData.businessPlace.id : null;

        if(formData.address){
          const addressRequest = await fetch(`${location.origin}/api/v1/address${formData.address.id ? ('/' + formData.address.id) : ""}`, {
            method: formData.address.id ? 'PATCH' : 'POST',
            body: JSON.stringify(formData.address),
          });

          if (addressRequest.ok) {
            const addr = await addressRequest.json();
            formData.address = addr.id;
          }
        }


        fetch(`${location.origin}/api/v1/${this.modelName}/${formData.id}`, {
          method: 'PATCH',
          body: JSON.stringify(formData),
        }).then(async res => {
          if (res.ok) {
            window.location.reload();
          } else {
            const textErr = await res.text();
            this.cloudError = `${res.statusText}: ${textErr}`;
          }
        })
      }
    },

    closeExampleModal: async function () {
      this.modal = '';
    },

    handleParsingForm: function () {
      // Clear out any pre-existing error messages.
      this.formErrors = {};

      // Validate password:
      if (!this.formData.fullName) {
        this.formErrors.fullName = true;
      }
      if (!this.formData.emailAddress) {
        this.formErrors.emailAddress = true;
      }
      /* // Validate password confirmation:
       if(argins.password && argins.password !== this.formData.confirmPassword) {
         this.formErrors.confirmPassword = true;
       }

       // If there were any issues, they've already now been communicated to the user,
       // so simply return undefined.  (This signifies that the submission should be
       // cancelled.)
       if (Object.keys(this.formErrors).length > 0) {
         return;
       }*/

    },

  }
});

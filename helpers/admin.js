
  
  module.exports = async (public_id, email) => {
      
      let isAdmin = false
      if(public_id!='') {
        const network = await strapi.db.query('network').findOne({
          public_id: public_id
        })
        isAdmin = ( network.creator == email );
        //console.log(network);
        //console.log(isAdmin);
      }

      return isAdmin;
  }
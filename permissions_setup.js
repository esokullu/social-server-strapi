/*
> db.getCollection('users-permissions_role').find({})
{ "_id" : ObjectId("61b0a66cb0e442325b315e26"), "name" : "Authenticated", "description" : "Default role given to authenticated user.", "type" : "authenticated", "__v" : 0 }
{ "_id" : ObjectId("61b0a66cb0e442325b315e27"), "name" : "Public", "description" : "Default role given to unauthenticated user.", "type" : "public", "__v" : 0 }
*/
db.getCollection('users-permissions_permission').insertMany([
   {
       "type" : "application",  // users-permissions
       "controller" : "blogs", 
       "action" : "count", 
       "enabled" : false, 
       "policy" : "", 
       "role": ""
    } 
]);

// db.getCollection('users-permissions_permission').updateMany({type:'users-permissions',controller:'auth',action:'register'}, {$set:{action:'signup'}});
// db.getCollection('users-permissions_permission').remove({type:'users-permissions',controller:'auth',action:'callback'});
//  db.getCollection('users-permissions_permission').updateMany({type:'users-permissions',controller:'auth',action:'login'}, {$set:{enabled:true}});
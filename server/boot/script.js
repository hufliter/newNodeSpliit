module.exports = function(app) {
  var User = app.models.Users;
  var Role = app.models.Role;
  var RoleMapping = app.models.RoleMapping;

  
  // Role.findOne({ where: { name: "admin" } }, function(err, role){
  //   console.log(role);
  //   if( err ) {
  //     return next(err);
  //   } 
  //   if (role) {
  //     role.principals.create({
  //       principalType: RoleMapping.USER,
  //       principalId: "56f8b57dda9198de6954082e"
  //     }, function(err, principal) {
  //       if (err) throw err;

  //       console.log('Created principal:', principal);
  //     });
  //   }
  // });

  
  // User.create([
  //   {username: 'John', email: 'john@doe.com', password: 'opensesame'},
  //   {username: 'Jane', email: 'jane@doe.com', password: 'opensesame'},
  //   {username: 'Bob', email: 'bob@projects.com', password: 'opensesame'}
  // ], function(err, users) {
  //   if (err) throw err;

  //   console.log('Created users:', users);


  //   //create the admin role
  //   Role.create({
  //     name: 'admin'
  //   }, function(err, role) {
  //     if (err) throw err;

  //     console.log('Created role:', role);

  //     //make bob an admin
  //     role.principals.create({
  //       principalType: RoleMapping.USER,
  //       principalId: users[2].id
  //     }, function(err, principal) {
  //       if (err) throw err;

  //       console.log('Created principal:', principal);
  //     });
  //   });
  // });
};
(function(root,factory){
 const api=factory();
 if(typeof module!=="undefined"&&module.exports)module.exports=api;
 root.AccountIsolation=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
 const PREFIX="football-tournaments-user-v1";
 const key=userId=>`${PREFIX}:${String(userId||"")}`;
 const owns=(tournament,userId)=>!!userId&&tournament?.ownerId===userId;
 const filterOwned=(tournaments,userId)=>(tournaments||[]).filter(t=>owns(t,userId));
 const ownerQuery=userId=>`owner_id=eq.${encodeURIComponent(userId)}`;
 function clearUserStorage(storage,userId){
  if(!storage)return;
  if(userId)storage.removeItem(key(userId));
  storage.removeItem("calcio-balilla-library-v2");
  storage.removeItem("calcio-balilla-manager-v1");
 }
 return{PREFIX,key,owns,filterOwned,ownerQuery,clearUserStorage};
});

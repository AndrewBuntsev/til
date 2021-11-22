// https://andreibuntsev.blogspot.com/2019/01/javascript-array-groupby-method.html#more
exports.groupBy = function(array, field) {
    let groupedArr = [];
    array.forEach(function(e) {
        //look for an existent group
        let group = groupedArr.find(g => g['field'] == e[field]);
        if (!group) {
            //add new group if it doesn't exist
            group = { field: e[field], groupList: [] };
            groupedArr.push(group);
        }
      
        //add the element to the group
        group.groupList.push(e);
    });
    
    return groupedArr;
}
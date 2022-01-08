const { groupBy } = require('lodash');

const groupStarred = (stars) => {
  const returnData = {}
  const groupedStars = groupBy(stars, (item)=>{
    return item.url ? item.url : item.blog.id
  })
  Object.entries(groupedStars).forEach(([key, item])=>{
    returnData[key] = {
      title: item[0]['url'] ? item[0]['urlTitle'] : item[0]['blog']['title'],
      star_count: item.length
    }
  })
  return returnData
}

module.exports = {
  groupStarred
}
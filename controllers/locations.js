const User = require("../models/users")

class LocationsCtl {

  async create(ctx) {
    ctx.verifyParams({
      province: { type: "string", required: true },
      city: { type: "string", required: true },
      area: { type: "string", required: true },
      address: { type: "string", required: true },
    })
    console.log(ctx.request.body)
    const { province, city, area, address } = ctx.request.body
    const data = await User.findById(ctx.state.user._id).select(
      "location"
    );

    const { location = [] } = data;

    console.log('location is ', location)
    location.push({
      province, city, area, address
    })
    
    data.location = location
    try {
      const body = await User.updateOne({ _id: ctx.state.user._id }, data);
      ctx.body = body
    } catch (e) {
      ctx.throw(500, e);
    }
  }
  // 修改
  async update(ctx) {
    // console.log(arr)
    let url = ctx.request.url.match(/^\/\D+\//)[0].replace(/\//g, '')
    if (url == "collection") {
      url = 'collect'
    }
    url = url.replace('-', '_')
    console.log(url)

    const { province, city, area, address } = ctx.request.body
    try {
      const data = await User.findById(ctx.state.user._id).select(
        url
      )


      data[url].forEach((item, index) => {
        console.log(item._id)
        if (item._id == ctx.params.id) {
          data[url][index] = {
            _id: item._id,
            province, city, area, address
          }
          console.log('item is ', item)
        }
      });

      try {
        const body = await User.updateOne({ _id: ctx.state.user._id }, data);
        ctx.body = body
      } catch (e) {
        ctx.throw(500, e);
      }
    } catch (e) {
      ctx.throw(500, e)
    }

  }

  async delete(ctx) {

    // let arr = /^\/\S+\/$/.match(ctx.request.url)

    // console.log(arr)
    let url = ctx.request.url.match(/^\/\D+\//)[0].replace(/\//g, '')
    console.log(url)
    // console.log(ctx.request.url);
    console.log('hh')

    if (url == "collection") {
      url = 'collect'
    }
    url = url.replace('-', '_')
    console.log(url)
    try {
      const data = await User.findById(ctx.state.user._id).select(
        url
      )
      console.log('data[url]  --- ', data[url])

      ctx.params.id.split(';').filter(e => e).map(item => {
        data[url] = data[url].filter(list => {
          // console.log('item is ---------------------',item)
          // console.log('list.commodity_id is ------- ',list.commodity_id)
          return item != list._id
        })
      })

      console.log('data[url]  +++ ', data[url])
      console.log('data==========', data)

      try {
        const body = await User.updateOne({ _id: ctx.state.user._id }, data);
        ctx.body = body
      } catch (e) {
        ctx.throw(500, e);
      }
    } catch (e) {
      ctx.throw(500, e)
    }

  }
}

module.exports = new LocationsCtl();
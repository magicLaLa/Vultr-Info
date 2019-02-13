//index.js
const app = getApp()

Page({
  data: {
    hideLoading: false,
    email: '',
    name: '',
    moneyPercent: '',
    pending_charges: '',
    remainCredit: '',
    ip: '',
    cpu: '',
    ram: '',
    server_type: '',
    status: '',
    location: '',
    serverUsage: '',
    currentChangesPer: '',
    serverUsagePer: ''
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    this.getVultrInfo()
  },

  getVultrInfo: function() {
    const _this = this
    // 调用云函数
    wx.cloud.callFunction({
      name: 'getVultrInfo'
    }).then((res) => {
      console.log('TCL: result', res.result)
      let data = res.result
      let balance = Math.abs(data.pending_charges / data.balance);
      let percentBalance = parseFloat(balance * 100).toFixed(2);
      let remainCredit = (parseFloat(data.pending_charges) + parseFloat(data.balance)).toFixed(2);
      let serverChargesPercent = parseFloat(data.pending_charges) / parseFloat(data.cost_per_month);
      let serverUsagePercent = parseFloat(data.current_bandwidth_gb) / parseFloat(data.allowed_bandwidth_gb);
      let currentChangesPer = parseFloat(serverChargesPercent * 100).toFixed(2)
      let serverUsagePer = parseFloat(serverUsagePercent * 100).toFixed(2)
      let cpu = data.vcpu_count
      cpu = cpu == 1 ? `${cpu} Core` : `${cpu} Cores`
      serverUsagePer = serverUsagePer < 1 ? 1 : serverUsagePer
      percentBalance = percentBalance < 1 ? 1 : percentBalance
      currentChangesPer = currentChangesPer < 1 ? 1 : currentChangesPer
      _this.setData({
        hideLoading: true,
        email: data.email,
        name: data.name,
        moneyPercent: percentBalance,
        pending_charges: data.pending_charges,
        remainCredit: Math.abs(remainCredit),
        ip: data.main_ip,
        cpu: cpu,
        ram: data.ram,
        server_type: data.os,
        status: data.status,
        location: data.location,
        serverUsage: data.current_bandwidth_gb,
        currentChangesPer: currentChangesPer,
        serverUsagePer: serverUsagePer
      })
    }).catch((err) => {
			console.log('TCL: err', err)
    })
  }

})

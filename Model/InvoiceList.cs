﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    /// <summary>
    /// 订单开票信息列表
    /// </summary>
    public class InvoiceList
    {
        public InvoiceList() {
            UserName = "";
            OrderNumber = "";
            OrderDetail = "";
            Price = "";
            SubmitTime = DateTime.Now;
            DealTime = DateTime.Now;
            PayTime = DateTime.Now;
            Status = 0;
            InvoiceInfoIndex = "";
            InvoiceType = 0;
            InvoiceFile = "";
            IssueType = 0;
        }
        /// <summary>
        /// ID
        /// </summary>
        public int ID { set; get; }
        /// <summary>
        /// 用户名
        /// </summary>
        public string UserName { set; get; }
        /// <summary>
        /// 订单号
        /// </summary>
        public string OrderNumber { set; get; }
        /// <summary>
        /// 订单详情
        /// </summary>
        public string OrderDetail { set; get; }
        /// <summary>
        /// 订单费用
        /// </summary>
        public string Price { set; get; }
        /// <summary>
        /// 申请发票时间
        /// </summary>
        public DateTime SubmitTime { set; get; }
        /// <summary>
        /// 处理完成时间
        /// </summary>
        public DateTime DealTime { set; get; }
        /// <summary>
        /// 订单支付时间
        /// </summary>
        public DateTime PayTime { set; get; }
        /// <summary>
        /// 申请处理状态 0 为未申请  1为申请中 2未申请完成，未开票 3为申请完成已开票 -1为申请失败
        /// </summary>
        public int Status { set; get; }
        /// <summary>
        /// 发票抬头 索引，获取发票信息
        /// </summary>
        public string InvoiceInfoIndex { set; get; }
        /// <summary>
        /// 发票类型 0-普通发票 1-增值税发票
        /// </summary>
        public int InvoiceType { set; get; }
        /// <summary>
        /// 开票方式 0-电子发票 1-纸质发票
        /// </summary>
        public int IssueType { set; get; }
        /// <summary>
        /// 发票文件路径
        /// </summary>
        public string InvoiceFile { set;get; }
    }
}

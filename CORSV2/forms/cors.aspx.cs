﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace CORSV2.forms
{
    public partial class cors : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            //Session["UserName"] = "admin";
            //Session["UserType"] = "3";
            if (Session["UserName"] == null || Session["UserType"] == null || Convert.ToInt32(Session["UserType"]) < 0 || Convert.ToInt32(Session["UserType"]) > 5)
            {
                Response.Write("<script>alert(\"请登录\");location.href = location.origin+\"/forms/publicforms/Login/Login.aspx\";</script>");
                Response.End();
            }
            if(Request["action"]=="username_judge")
            {
                Model.RegisterUser registeruser = DAL.RegisterUser.GetModel(Session["UserName"].ToString());
                if (registeruser.CertifiationIndex != "")
                {
                    //location.href = location.origin+\"/forms/cors.aspx\";
                    Response.Write("<script>alert(\"认证审核中，请等待\");</script>");
                    Response.End();
                }
                else
                {
                    Response.Write("unregister");
                    Response.End();
                }
            }
       

            if (!IsPostBack)
            {
                UserName.InnerText = Session["UserName"].ToString();
                if (Session["UserType"].ToString() == "1")
                {
                    UserType.InnerText = "超级管理员";
                }
                else
                {
                    UserType.InnerText = "普通用户";
                }
            }
        }
    }
}
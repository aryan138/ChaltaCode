const express = require("express");
const crypto = require("crypto");
const order = require("../models/order");
const mail = require("../helper/orderMail");
const Product = require("../models/Product");
const SuperProduct = require("../models/superProduct");

const placeorder = async (req, res) => {
  
  try {

    const { product_id, product_quantity } = req.body;
  
    if (!product_id || !product_quantity) {
      return res.status(400).json({ message: "Product ID and quantity are required" });
    }

    //find the superProduct name
    const superProduct = await SuperProduct.findById(product_id);
    if (!superProduct) res.json({
      status:401,
      message:"product not found",
    })
    // console.log("superProduct",superProduct.name);
    const product_name = superProduct.name;
    const productId = superProduct.product_id;
    // console.log("product name is :"+product_name);

    const createOrder = await order.create({
      order_id:`profitex${productId}${parseInt(Math.random() * 100)}`,
      product_quantity: product_quantity,
      product_name: product_name
    });
    // console.log("chalra hai yaha tk",createOrder);
  

    // Generate unique tokens for accept/reject links
    const acceptToken = crypto.randomBytes(16).toString("hex");
    const rejectToken = crypto.randomBytes(16).toString("hex");

    createOrder.acceptToken = acceptToken;
    createOrder.rejectToken = rejectToken;
    await createOrder.save();

    const baseUrl = req.protocol + "://" + req.get("host");
    const acceptUrl =` ${baseUrl}/order/accept/${createOrder._id}/${acceptToken}`;
    const rejectUrl = `${baseUrl}/order/reject/${createOrder._id}/${rejectToken}`;

    const recipientEmail = "amansharma865865@gmail.com";
    const mailContent = `
      <!DOCTYPE html>
<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
 <meta charset="UTF-8" />
 <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
 <!--[if !mso]><!-- -->
 <meta http-equiv="X-UA-Compatible" content="IE=edge" />
 <!--<![endif]-->
 <meta name="viewport" content="width=device-width, initial-scale=1.0" />
 <meta name="format-detection" content="telephone=no" />
 <meta name="format-detection" content="date=no" />
 <meta name="format-detection" content="address=no" />
 <meta name="format-detection" content="email=no" />
 <meta name="x-apple-disable-message-reformatting" />
 <link href="https://fonts.googleapis.com/css?family=Anek+Tamil:ital,wght@0,400" rel="stylesheet" />
 <link href="https://fonts.googleapis.com/css?family=Fira+Sans:ital,wght@0,400;0,500;0,700;0,800" rel="stylesheet" />
 <title>Untitled</title>
 <!-- Made with Postcards Email Builder by Designmodo -->
 <!--[if !mso]><!-- -->
 <style>
 /* cyrillic-ext */
         @font-face { font-family: 'Fira Sans'; font-style: normal; font-weight: 400; src: local('Fira Sans Regular'), local('FiraSans-Regular'), url(https://fonts.gstatic.com/s/firasans/v10/va9E4kDNxMZdWfMOD5VvmojLazX3dGTP.woff2) format('woff2'); unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F; }
         /* cyrillic */
         @font-face { font-family: 'Fira Sans'; font-style: normal; font-weight: 400; src: local('Fira Sans Regular'), local('FiraSans-Regular'), url(https://fonts.gstatic.com/s/firasans/v10/va9E4kDNxMZdWfMOD5Vvk4jLazX3dGTP.woff2) format('woff2'); unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116; }
         /* latin-ext */
         @font-face { font-family: 'Fira Sans'; font-style: normal; font-weight: 400; src: local('Fira Sans Regular'), local('FiraSans-Regular'), url(https://fonts.gstatic.com/s/firasans/v10/va9E4kDNxMZdWfMOD5VvmYjLazX3dGTP.woff2) format('woff2'); unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF; }
         /* latin */
         @font-face { font-family: 'Fira Sans'; font-style: normal; font-weight: 400; src: local('Fira Sans Regular'), local('FiraSans-Regular'), url(https://fonts.gstatic.com/s/firasans/v10/va9E4kDNxMZdWfMOD5Vvl4jLazX3dA.woff2) format('woff2'); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }
                         /* cyrillic-ext */
         @font-face { font-family: 'Fira Sans'; font-style: normal; font-weight: 500; src: local('Fira Sans Medium'), local('FiraSans-Medium'), url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnZKveSxf6Xl7Gl3LX.woff2) format('woff2'); unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F; }
         /* cyrillic */
         @font-face { font-family: 'Fira Sans'; font-style: normal; font-weight: 500; src: local('Fira Sans Medium'), local('FiraSans-Medium'), url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnZKveQhf6Xl7Gl3LX.woff2) format('woff2'); unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116; }
         /* latin-ext */
         @font-face { font-family: 'Fira Sans'; font-style: normal; font-weight: 500; src: local('Fira Sans Medium'), local('FiraSans-Medium'), url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnZKveSBf6Xl7Gl3LX.woff2) format('woff2'); unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF; }
         /* latin */
         @font-face { font-family: 'Fira Sans'; font-style: normal; font-weight: 500; src: local('Fira Sans Medium'), local('FiraSans-Medium'), url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnZKveRhf6Xl7Glw.woff2) format('woff2'); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }
                         /* cyrillic-ext */
         @font-face { font-family: 'Fira Sans'; font-style: normal; font-weight: 700; src: local('Fira Sans Bold'), local('FiraSans-Bold'), url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnLK3eSxf6Xl7Gl3LX.woff2) format('woff2'); unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F; }
         /* cyrillic */
         @font-face { font-family: 'Fira Sans'; font-style: normal; font-weight: 700; src: local('Fira Sans Bold'), local('FiraSans-Bold'), url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnLK3eQhf6Xl7Gl3LX.woff2) format('woff2'); unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116; }
         /* latin-ext */
         @font-face { font-family: 'Fira Sans'; font-style: normal; font-weight: 700; src: local('Fira Sans Bold'), local('FiraSans-Bold'), url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnLK3eSBf6Xl7Gl3LX.woff2) format('woff2'); unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF; }
         /* latin */
         @font-face { font-family: 'Fira Sans'; font-style: normal; font-weight: 700; src: local('Fira Sans Bold'), local('FiraSans-Bold'), url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnLK3eRhf6Xl7Glw.woff2) format('woff2'); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }
                         /* cyrillic-ext */
         @font-face { font-family: 'Fira Sans'; font-style: normal; font-weight: 800; font-display: swap; src: local('Fira Sans ExtraBold'), local('FiraSans-ExtraBold'), url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnMK7eSxf6Xl7Gl3LX.woff2) format('woff2'); unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F; }
         /* cyrillic */
         @font-face { font-family: 'Fira Sans'; font-style: normal; font-weight: 800; font-display: swap; src: local('Fira Sans ExtraBold'), local('FiraSans-ExtraBold'), url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnMK7eQhf6Xl7Gl3LX.woff2) format('woff2'); unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116; }
         /* latin-ext */
         @font-face { font-family: 'Fira Sans'; font-style: normal; font-weight: 800; font-display: swap; src: local('Fira Sans ExtraBold'), local('FiraSans-ExtraBold'), url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnMK7eSBf6Xl7Gl3LX.woff2) format('woff2'); unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF; }
         /* latin */
         @font-face { font-family: 'Fira Sans'; font-style: normal; font-weight: 800; font-display: swap; src: local('Fira Sans ExtraBold'), local('FiraSans-ExtraBold'), url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnMK7eRhf6Xl7Glw.woff2) format('woff2'); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }
 </style>
 <!--<![endif]-->
 <style>
 html,
         body {
             margin: 0 !important;
             padding: 0 !important;
             min-height: 100% !important;
             width: 100% !important;
             -webkit-font-smoothing: antialiased;
         }
 
         * {
             -ms-text-size-adjust: 100%;
         }
 
         #outlook a {
             padding: 0;
         }
 
         .ReadMsgBody,
         .ExternalClass {
             width: 100%;
         }
 
         .ExternalClass,
         .ExternalClass p,
         .ExternalClass td,
         .ExternalClass div,
         .ExternalClass span,
         .ExternalClass font {
             line-height: 100%;
         }
 
         table,
         td,
         th {
             mso-table-lspace: 0 !important;
             mso-table-rspace: 0 !important;
             border-collapse: collapse;
         }
 
         u + .body table, u + .body td, u + .body th {
             will-change: transform;
         }
 
         body, td, th, p, div, li, a, span {
             -webkit-text-size-adjust: 100%;
             -ms-text-size-adjust: 100%;
             mso-line-height-rule: exactly;
         }
 
         img {
             border: 0;
             outline: 0;
             line-height: 100%;
             text-decoration: none;
             -ms-interpolation-mode: bicubic;
         }
 
         a[x-apple-data-detectors] {
             color: inherit !important;
             text-decoration: none !important;
         }
 
         .pc-gmail-fix {
             display: none;
             display: none !important;
         }
 
         .body .pc-project-body {
             background-color: transparent !important;
         }
 
         @media (min-width: 621px) {
             .pc-lg-hide {
                 display: none;
             } 
 
             .pc-lg-bg-img-hide {
                 background-image: none !important;
             }
         }
 </style>
 <style>
 @media (max-width: 620px) {
 .pc-project-body {min-width: 0px !important;}
 .pc-project-container {width: 100% !important;}
 .pc-sm-hide {display: none !important;}
 .pc-sm-bg-img-hide {background-image: none !important;}
 .pc-w620-width-200 {width: 200px !important;}
 .pc-w620-height-auto {height: auto !important;}
 .pc-w620-itemsSpacings-10-0 {padding-left: 5px !important;padding-right: 5px !important;padding-top: 0px !important;padding-bottom: 0px !important;}
 table.pc-w620-spacing-0-0-70-0 {margin: 0px 0px 70px 0px !important;}
 td.pc-w620-spacing-0-0-70-0,th.pc-w620-spacing-0-0-70-0{margin: 0 !important;padding: 0px 0px 70px 0px !important;}
 table.pc-w620-spacing-0-0-10-0 {margin: 0px 0px 10px 0px !important;}
 td.pc-w620-spacing-0-0-10-0,th.pc-w620-spacing-0-0-10-0{margin: 0 !important;padding: 0px 0px 10px 0px !important;}
 .pc-w620-fontSize-30 {font-size: 30px !important;}
 .pc-w620-lineHeight-40 {line-height: 40px !important;}
 .pc-w620-padding-32-35-32-35 {padding: 32px 35px 32px 35px !important;}
 .pc-w620-fontSize-40px {font-size: 40px !important;}
 .pc-w620-lineHeight-133pc {line-height: 133% !important;}
 .pc-w620-fontSize-18 {font-size: 18px !important;}
 .pc-w620-lineHeight-156pc {line-height: 156% !important;}
 .pc-w620-itemsSpacings-0-30 {padding-left: 0px !important;padding-right: 0px !important;padding-top: 15px !important;padding-bottom: 15px !important;}
 .pc-w620-fontSize-16 {font-size: 16px !important;}
 .pc-w620-lineHeight-163pc {line-height: 163% !important;}
 .pc-w620-itemsSpacings-0-10 {padding-left: 0px !important;padding-right: 0px !important;padding-top: 5px !important;padding-bottom: 5px !important;}
 .pc-w620-lineHeight-125pc {line-height: 125% !important;}
 .pc-w620-padding-35-35-35-35 {padding: 35px 35px 35px 35px !important;}
 .pc-w620-itemsSpacings-20-0 {padding-left: 10px !important;padding-right: 10px !important;padding-top: 0px !important;padding-bottom: 0px !important;}
 
 .pc-w620-gridCollapsed-1 > tbody,.pc-w620-gridCollapsed-1 > tbody > tr,.pc-w620-gridCollapsed-1 > tr {display: inline-block !important;}
 .pc-w620-gridCollapsed-1.pc-width-fill > tbody,.pc-w620-gridCollapsed-1.pc-width-fill > tbody > tr,.pc-w620-gridCollapsed-1.pc-width-fill > tr {width: 100% !important;}
 .pc-w620-gridCollapsed-1.pc-w620-width-fill > tbody,.pc-w620-gridCollapsed-1.pc-w620-width-fill > tbody > tr,.pc-w620-gridCollapsed-1.pc-w620-width-fill > tr {width: 100% !important;}
 .pc-w620-gridCollapsed-1 > tbody > tr > td,.pc-w620-gridCollapsed-1 > tr > td {display: block !important;width: auto !important;padding-left: 0 !important;padding-right: 0 !important;margin-left: 0 !important;}
 .pc-w620-gridCollapsed-1.pc-width-fill > tbody > tr > td,.pc-w620-gridCollapsed-1.pc-width-fill > tr > td {width: 100% !important;}
 .pc-w620-gridCollapsed-1.pc-w620-width-fill > tbody > tr > td,.pc-w620-gridCollapsed-1.pc-w620-width-fill > tr > td {width: 100% !important;}
 .pc-w620-gridCollapsed-1 > tbody > .pc-grid-tr-first > .pc-grid-td-first,pc-w620-gridCollapsed-1 > .pc-grid-tr-first > .pc-grid-td-first {padding-top: 0 !important;}
 .pc-w620-gridCollapsed-1 > tbody > .pc-grid-tr-last > .pc-grid-td-last,pc-w620-gridCollapsed-1 > .pc-grid-tr-last > .pc-grid-td-last {padding-bottom: 0 !important;}
 
 .pc-w620-gridCollapsed-0 > tbody > .pc-grid-tr-first > td,.pc-w620-gridCollapsed-0 > .pc-grid-tr-first > td {padding-top: 0 !important;}
 .pc-w620-gridCollapsed-0 > tbody > .pc-grid-tr-last > td,.pc-w620-gridCollapsed-0 > .pc-grid-tr-last > td {padding-bottom: 0 !important;}
 .pc-w620-gridCollapsed-0 > tbody > tr > .pc-grid-td-first,.pc-w620-gridCollapsed-0 > tr > .pc-grid-td-first {padding-left: 0 !important;}
 .pc-w620-gridCollapsed-0 > tbody > tr > .pc-grid-td-last,.pc-w620-gridCollapsed-0 > tr > .pc-grid-td-last {padding-right: 0 !important;}
 
 .pc-w620-tableCollapsed-1 > tbody,.pc-w620-tableCollapsed-1 > tbody > tr,.pc-w620-tableCollapsed-1 > tr {display: block !important;}
 .pc-w620-tableCollapsed-1.pc-width-fill > tbody,.pc-w620-tableCollapsed-1.pc-width-fill > tbody > tr,.pc-w620-tableCollapsed-1.pc-width-fill > tr {width: 100% !important;}
 .pc-w620-tableCollapsed-1.pc-w620-width-fill > tbody,.pc-w620-tableCollapsed-1.pc-w620-width-fill > tbody > tr,.pc-w620-tableCollapsed-1.pc-w620-width-fill > tr {width: 100% !important;}
 .pc-w620-tableCollapsed-1 > tbody > tr > td,.pc-w620-tableCollapsed-1 > tr > td {display: block !important;width: auto !important;}
 .pc-w620-tableCollapsed-1.pc-width-fill > tbody > tr > td,.pc-w620-tableCollapsed-1.pc-width-fill > tr > td {width: 100% !important;box-sizing: border-box !important;}
 .pc-w620-tableCollapsed-1.pc-w620-width-fill > tbody > tr > td,.pc-w620-tableCollapsed-1.pc-w620-width-fill > tr > td {width: 100% !important;box-sizing: border-box !important;}
 }
 @media (max-width: 520px) {
 table.pc-w520-spacing-0-0-50-0 {margin: 0px 0px 50px 0px !important;}
 td.pc-w520-spacing-0-0-50-0,th.pc-w520-spacing-0-0-50-0{margin: 0 !important;padding: 0px 0px 50px 0px !important;}
 .pc-w520-padding-27-30-27-30 {padding: 27px 30px 27px 30px !important;}
 .pc-w520-padding-30-30-30-30 {padding: 30px 30px 30px 30px !important;}
 }
 </style>
 <!--[if !mso]><!-- -->
 <style>
 @font-face { font-family: 'Fira Sans'; font-style: normal; font-weight: 400; src: url('https://fonts.gstatic.com/s/firasans/v17/va9E4kDNxMZdWfMOD5VvmYjN.woff') format('woff'), url('https://fonts.gstatic.com/s/firasans/v17/va9E4kDNxMZdWfMOD5VvmYjL.woff2') format('woff2'); } @font-face { font-family: 'Fira Sans'; font-style: normal; font-weight: 500; src: url('https://fonts.gstatic.com/s/firasans/v17/va9B4kDNxMZdWfMOD5VnZKveSBf8.woff') format('woff'), url('https://fonts.gstatic.com/s/firasans/v17/va9B4kDNxMZdWfMOD5VnZKveSBf6.woff2') format('woff2'); } @font-face { font-family: 'Fira Sans'; font-style: normal; font-weight: 800; src: url('https://fonts.gstatic.com/s/firasans/v17/va9B4kDNxMZdWfMOD5VnMK7eSBf8.woff') format('woff'), url('https://fonts.gstatic.com/s/firasans/v17/va9B4kDNxMZdWfMOD5VnMK7eSBf6.woff2') format('woff2'); } @font-face { font-family: 'Fira Sans'; font-style: normal; font-weight: 700; src: url('https://fonts.gstatic.com/s/firasans/v17/va9B4kDNxMZdWfMOD5VnLK3eSBf8.woff') format('woff'), url('https://fonts.gstatic.com/s/firasans/v17/va9B4kDNxMZdWfMOD5VnLK3eSBf6.woff2') format('woff2'); }
 </style>
</head>

<body class="body pc-font-alt" style="width: 100% !important; min-height: 100% !important; margin: 0 !important; padding: 0 !important; line-height: 1.5; color: #2D3A41; mso-line-height-rule: exactly; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; font-variant-ligatures: normal; text-rendering: optimizeLegibility; -moz-osx-font-smoothing: grayscale; background-color: #f4f4f4;" bgcolor="#f4f4f4">
 <table class="pc-project-body" style="table-layout: fixed; min-width: 1000px; background-color: #f4f4f4;" bgcolor="#f4f4f4" width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
  <tr>
   <td align="center" valign="top">
    <table class="pc-project-container" align="center" width="1000" style="width: 1000px; max-width: 1000px;" border="0" cellpadding="0" cellspacing="0" role="presentation">
     <tr>
      <td style="padding: 20px 0px 20px 0px;" align="left" valign="top">
       <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="width: 100%;">
        <tr>
         <td valign="top">
          <!-- BEGIN MODULE: Header 1 -->
          <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
           <tr>
            <td style="padding: 0px 0px 0px 0px;">
             <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
              <tr>
               
               <td valign="top" class="pc-w520-padding-27-30-27-30 pc-w620-padding-32-35-32-35" style="background-image: url('https://cloudfilesdm.com/postcards/header-1-image-1.jpg'); background-size: auto; background-position: left center; background-repeat: no-repeat; padding: 37px 40px 37px 40px; border-radius: 0px; background-color: #1B1B1B;" bgcolor="#1B1B1B" background="https://cloudfilesdm.com/postcards/header-1-image-1.jpg">
                
                <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                 <tr>
                    <td align="center" valign="top" style="padding: 0px 0px 22px 0px;">
                        <h1 style="font-family: 'Roboto', 'Helvetica Neue', Arial, sans-serif; font-size: 42px; font-weight: 900; color: #ffffff; margin: 0; line-height: 1.2; letter-spacing: 1px;">
                            PROFITEX
                          </h1>
                      </td>
                      

                 </tr>
                </table>
                <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                 <tr>
                  <td class="pc-w520-spacing-0-0-50-0 pc-w620-spacing-0-0-70-0" align="left" style="padding: 0px 0px 40px 0px;">
                   <table class="pc-width-hug pc-w620-gridCollapsed-0" align="left" border="0" cellpadding="0" cellspacing="0" role="presentation">
                    <tr class="pc-grid-tr-first pc-grid-tr-last">
                     <td class="pc-grid-td-first pc-grid-td-last pc-w620-itemsSpacings-10-0" valign="top" style="padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px;">
                      <table style="border-collapse: separate; border-spacing: 0;" border="0" cellpadding="0" cellspacing="0" role="presentation">
                       <tr>
                        <td align="left" valign="top">
                         <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;">
                          <tr>
                           <td align="left" valign="top">
                            <table align="left" border="0" cellpadding="0" cellspacing="0" role="presentation">
                             <tr>
                              <td valign="top" style="padding: 10px 0px 0px 0px;">
                               <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="border-collapse: separate; border-spacing: 0;">
                                <tr>
                                 <td valign="top" align="center" style="padding: 0px 0px 0px 0px;">
                                  <div class="pc-font-alt" style="line-height: 25px; letter-spacing: -0.2px; font-family: 'Anek Tamil', Arial, Helvetica, sans-serif; font-size: 16px; font-weight: normal; font-variant-ligatures: normal; color: #ffffff; text-align: center; text-align-last: center;">
                                   <div><span style="font-family: 'Anek Tamil', Arial, Helvetica, sans-serif;font-weight: 400;font-style: normal;color: rgb(255, 255, 255);letter-spacing: 0px;">Profitex is an advanced smart billing management system designed to streamline and optimize your business operations. With its intuitive dashboard, Profitex provides a comprehensive overview of your financial health, enabling you to track key metrics at a glance. The system&#39;s powerful order tables simplify order management, allowing you to efficiently process and monitor transactions.</span>
                                   </div>
                                  </div>
                                 </td>
                                </tr>
                               </table>
                              </td>
                             </tr>
                            </table>
                           </td>
                          </tr>
                         </table>
                        </td>
                       </tr>
                      </table>
                     </td>
                    </tr>
                   </table>
                  </td>
                 </tr>
                </table>
                <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                 <tr>
                  <td class="pc-w620-spacing-0-0-10-0" align="left" valign="top" style="padding: 0px 0px 0px 0px;">
                   <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="border-collapse: separate; border-spacing: 0; margin-right: auto; margin-left: auto;">
                    <tr>
                     <td valign="top" align="left">
                      <div class="pc-font-alt" style="line-height: 17px; letter-spacing: 0px; font-family: 'Fira Sans', Arial, Helvetica, sans-serif; font-size: 14px; font-weight: 500; font-variant-ligatures: normal; color: #ffffff; text-align: left; text-align-last: left;">
                       <div><span style="letter-spacing: 0px;">23 November</span>
                       </div>
                      </div>
                     </td>
                    </tr>
                   </table>
                  </td>
                 </tr>
                </table>
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="border-collapse: separate; border-spacing: 0; margin-right: auto; margin-left: auto;">
                 <tr>
                  <td valign="top" align="left">
                   <div class="pc-font-alt pc-w620-fontSize-30 pc-w620-lineHeight-40" style="line-height: 46px; letter-spacing: -0.6px; font-family: 'Fira Sans', Arial, Helvetica, sans-serif; font-size: 36px; font-weight: 800; font-variant-ligatures: normal; color: #ffffff; text-align: left; text-align-last: left;">
                    <div><span>Let&#39;s take a step Further !!</span>
                    </div>
                   </div>
                  </td>
                 </tr>
                </table>
               </td>
              </tr>
             </table>
            </td>
           </tr>
          </table>
          <!-- END MODULE: Header 1 -->
         </td>
        </tr>
        <tr>
         <td valign="top">
          <!-- BEGIN MODULE: Transactional 5 -->
          <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
           <tr>
            <td style="padding: 0px 0px 0px 0px;">
             <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
              <tr>
               <td valign="top" class="pc-w520-padding-30-30-30-30 pc-w620-padding-35-35-35-35" style="padding: 40px 40px 40px 40px; border-radius: 0px; background-color: #ffffff;" bgcolor="#ffffff">
                <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                 <tr>
                  <td align="left" valign="top" style="padding: 0px 0px 18px 0px;">
                   <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="border-collapse: separate; border-spacing: 0; margin-right: auto; margin-left: auto;">
                    <tr>
                     <td valign="top" align="left">
                      <div class="pc-font-alt" style="line-height: 121%; letter-spacing: -0.2px; font-family: 'Fira Sans', Arial, Helvetica, sans-serif; font-size: 14px; font-weight: 500; font-variant-ligatures: normal; color: #40be65; text-align: left; text-align-last: left;">
                       Order #435426</div>
                     </td>
                    </tr>
                   </table>
                  </td>
                 </tr>
                </table>
                <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                 <tr>
                  <td align="left" valign="top" style="padding: 0px 0px 15px 0px;">
                   <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="border-collapse: separate; border-spacing: 0; margin-right: auto; margin-left: auto;">
                    <tr>
                     <td valign="top" align="left">
                      <div class="pc-font-alt pc-w620-fontSize-40px pc-w620-lineHeight-133pc" style="line-height: 128%; letter-spacing: -0.6px; font-family: 'Fira Sans', Arial, Helvetica, sans-serif; font-size: 36px; font-weight: 800; font-variant-ligatures: normal; color: #151515; text-align: left; text-align-last: left;">
                       <div><span>Hello !!</span>
                       </div>
                      </div>
                     </td>
                    </tr>
                   </table>
                  </td>
                 </tr>
                </table>
                <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                 <tr>
                  <td align="left" valign="top" style="padding: 0px 0px 20px 0px;">
                   <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="border-collapse: separate; border-spacing: 0; margin-right: auto; margin-left: auto;">
                    <tr>
                     <td valign="top" align="left">
                      <div class="pc-font-alt pc-w620-fontSize-18 pc-w620-lineHeight-156pc" style="line-height: 155%; letter-spacing: -0.4px; font-family: 'Fira Sans', Arial, Helvetica, sans-serif; font-size: 22px; font-weight: normal; font-variant-ligatures: normal; color: #9b9b9b; text-align: left; text-align-last: left;">
                       <div><span>A new order is placed :</span>
                       </div>
                      </div>
                     </td>
                    </tr>
                   </table>
                  </td>
                 </tr>
                </table>
                <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                 <tr>
                    <th valign="top" align="left" style="padding: 0px 0px 40px 0px; text-align: left; font-weight: normal; line-height: 1;">
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" align="left" style="border-collapse: separate; border-spacing: 0;">
                          <tr>
                            <!-- First Button -->
                            <td valign="middle" align="center" style="border-radius: 8px; background-color: #1f962f; text-align:center; color: #ffffff; padding: 14px 19px; mso-padding-left-alt: 0; margin-right: 10px;" bgcolor="#1595e7">
                              <a class="pc-font-alt" style="display: inline-block; text-decoration: none; font-variant-ligatures: normal; font-family: 'Fira Sans', Arial, Helvetica, sans-serif; font-weight: 500; font-size: 16px; line-height: 150%; letter-spacing: -0.2px; text-align: center; color: #ffffff;" href="${acceptUrl}" target="_blank">Accept Order</a>
                            </td>
                      
                            <!-- Gap Between Buttons -->
                            <td style="width: 10px;"></td>
                      
                            <!-- Second Button -->
                            <td valign="middle" align="center" style="border-radius: 8px; background-color: #b72020; text-align:center; color: #ffffff; padding: 14px 19px; mso-padding-left-alt: 0;" bgcolor="#1595e7">
                              <a class="pc-font-alt" style="display: inline-block; text-decoration: none; font-variant-ligatures: normal; font-family: 'Fira Sans', Arial, Helvetica, sans-serif; font-weight: 500; font-size: 16px; line-height: 150%; letter-spacing: -0.2px; text-align: center; color: #ffffff;" href="${rejectUrl}" target="_blank">Reject Order</a>
                            </td>
                          </tr>
                        </table>
                      </th>
                      
                      
                 </tr>
                </table>
                <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                 <tr>
                  <td style="padding: 0px 0px 50px 0px;">
                   <table class="pc-width-fill pc-w620-gridCollapsed-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                    <tr class="pc-grid-tr-first pc-grid-tr-last">
                     <td class="pc-grid-td-first pc-w620-itemsSpacings-0-30" align="left" valign="top" style="width: 50%; padding-top: 0px; padding-right: 20px; padding-bottom: 0px; padding-left: 0px;">
                      <table style="border-collapse: separate; border-spacing: 0; width: 100%;" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                       <tr>
                        <td align="left" valign="top">
                         <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;">
                          <tr>
                           <td align="left" valign="top">
                            <table align="left" border="0" cellpadding="0" cellspacing="0" role="presentation">
                             <tr>
                              <td valign="top" style="padding: 0px 0px 10px 0px;">
                               <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="border-collapse: separate; border-spacing: 0;">
                                <tr>
                                 <td valign="top" align="left">
                                  <div class="pc-font-alt" style="line-height: 156%; letter-spacing: -0.2px; font-family: 'Fira Sans', Arial, Helvetica, sans-serif; font-size: 18px; font-weight: bold; font-variant-ligatures: normal; color: #151515; text-align: left; text-align-last: left;">
                                   Order number</div>
                                 </td>
                                </tr>
                               </table>
                              </td>
                             </tr>
                            </table>
                           </td>
                          </tr>
                          <tr>
                           <td align="left" valign="top">
                            <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;">
                             <tr>
                              <td valign="top" style="padding: 0px 0px 10px 0px;">
                               <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin-right: auto;">
                                <tr>
                                 <!--[if gte mso 9]>
                    <td height="1" valign="top" style="line-height: 1px; font-size: 1px; border-bottom: 1px solid #e5e5e5;">&nbsp;</td>
                <![endif]-->
                                 <!--[if !gte mso 9]><!-- -->
                                 <td height="1" valign="top" style="line-height: 1px; font-size: 1px; border-bottom: 1px solid #e5e5e5;">&nbsp;</td>
                                 <!--<![endif]-->
                                </tr>
                               </table>
                              </td>
                             </tr>
                            </table>
                           </td>
                          </tr>
                          <tr>
                           <td align="left" valign="top">
                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" align="left" style="border-collapse: separate; border-spacing: 0;">
                             <tr>
                              <td valign="top" align="left">
                               <div class="pc-font-alt" style="line-height: 156%; letter-spacing: -0.2px; font-family: 'Fira Sans', Arial, Helvetica, sans-serif; font-size: 18px; font-weight: normal; font-variant-ligatures: normal; color: #151515; text-align: left; text-align-last: left;">
                                435426</div>
                              </td>
                             </tr>
                            </table>
                           </td>
                          </tr>
                         </table>
                        </td>
                       </tr>
                      </table>
                     </td>
                     <td class="pc-grid-td-last pc-w620-itemsSpacings-0-30" align="left" valign="top" style="width: 50%; padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 20px;">
                      <table style="border-collapse: separate; border-spacing: 0; width: 100%;" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                       <tr>
                        <td align="left" valign="top">
                         <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;">
                          <tr>
                           <td align="left" valign="top">
                            <table align="left" border="0" cellpadding="0" cellspacing="0" role="presentation">
                             <tr>
                              <td valign="top" style="padding: 0px 0px 10px 0px;">
                               <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="border-collapse: separate; border-spacing: 0;">
                                <tr>
                                 <td valign="top" align="left">
                                  <div class="pc-font-alt" style="line-height: 156%; letter-spacing: -0.2px; font-family: 'Fira Sans', Arial, Helvetica, sans-serif; font-size: 18px; font-weight: bold; font-variant-ligatures: normal; color: #151515; text-align: left; text-align-last: left;">
                                   Order date</div>
                                 </td>
                                </tr>
                               </table>
                              </td>
                             </tr>
                            </table>
                           </td>
                          </tr>
                          <tr>
                           <td align="left" valign="top">
                            <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;">
                             <tr>
                              <td valign="top" style="padding: 0px 0px 10px 0px;">
                               <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin-right: auto;">
                                <tr>
                                 <!--[if gte mso 9]>
                    <td height="1" valign="top" style="line-height: 1px; font-size: 1px; border-bottom: 1px solid #e5e5e5;">&nbsp;</td>
                <![endif]-->
                                 <!--[if !gte mso 9]><!-- -->
                                 <td height="1" valign="top" style="line-height: 1px; font-size: 1px; border-bottom: 1px solid #e5e5e5;">&nbsp;</td>
                                 <!--<![endif]-->
                                </tr>
                               </table>
                              </td>
                             </tr>
                            </table>
                           </td>
                          </tr>
                          <tr>
                           <td align="left" valign="top">
                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" align="left" style="border-collapse: separate; border-spacing: 0;">
                             <tr>
                              <td valign="top" align="left">
                               <div class="pc-font-alt" style="line-height: 156%; letter-spacing: -0.2px; font-family: 'Fira Sans', Arial, Helvetica, sans-serif; font-size: 18px; font-weight: normal; font-variant-ligatures: normal; color: #151515; text-align: left; text-align-last: left;">
                                21 June
                              </div>
                              </td>
                             </tr>
                            </table>
                           </td>
                          </tr>
                         </table>
                        </td>
                       </tr>
                      </table>
                     </td>
                    </tr>
                   </table>
                  </td>
                 </tr>
                </table>
                <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                 <tr>
                  <td style="padding: 0px 0px 10px 0px; ">
                   <table class="pc-w620-tableCollapsed-0" border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="border-collapse: separate; border-spacing: 0; width: 100%;">
                    <tbody>
                     <tr>
                      <td align="left" valign="top" style="padding: 20px 10px 20px 0px; border-bottom: 1px solid #E5E5E5;">
                       <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="border-collapse: separate; border-spacing: 0; margin-right: auto; margin-left: auto;">
                        <tr>
                         <td valign="top" align="left">
                          <div class="pc-font-alt pc-w620-fontSize-16 pc-w620-lineHeight-163pc" style="line-height: 156%; letter-spacing: -0.2px; font-family: 'Fira Sans', Arial, Helvetica, sans-serif; font-size: 18px; font-weight: bold; font-variant-ligatures: normal; color: #151515; text-align: left; text-align-last: left;">
                           Item</div>
                         </td>
                        </tr>
                       </table>
                      </td>
                      <td align="left" valign="top" style="padding: 20px 0px 20px 0px; border-bottom: 1px solid #E5E5E5;">
                       <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="border-collapse: separate; border-spacing: 0; margin-right: auto; margin-left: auto;">
                        <tr>
                         <td valign="top" align="right">
                          <div class="pc-font-alt pc-w620-fontSize-16 pc-w620-lineHeight-163pc" style="line-height: 156%; letter-spacing: -0.2px; font-family: 'Fira Sans', Arial, Helvetica, sans-serif; font-size: 18px; font-weight: bold; font-variant-ligatures: normal; color: #151515; text-align: right; text-align-last: right;">
                           Qty</div>
                         </td>
                        </tr>
                       </table>
                      </td>
                     </tr>
                     <tr>
                      <td align="left" valign="top" style="padding: 20px 10px 20px 0px; border-bottom: 1px solid #E5E5E5;">
                       <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                        <tr>
                         <td align="left">
                          <table class="pc-width-hug pc-w620-gridCollapsed-1" align="left" border="0" cellpadding="0" cellspacing="0" role="presentation">
                           <tr class="pc-grid-tr-first pc-grid-tr-last">
                            <td class="pc-grid-td-first pc-grid-td-last pc-w620-itemsSpacings-0-10" valign="top" style="padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px;">
                             <table style="border-collapse: separate; border-spacing: 0;" border="0" cellpadding="0" cellspacing="0" role="presentation">
                              <tr>
                               <td align="left" valign="top">
                                <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;">
                                 <tr>
                                  <td align="left" valign="top">
                                   <table align="left" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                    <tr>
                                     <td valign="top" style="padding: 9px 0px 4px 0px;">
                                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="border-collapse: separate; border-spacing: 0;">
                                       <tr>
                                        <td valign="top" align="left">
                                         <div class="pc-font-alt pc-w620-fontSize-16 pc-w620-lineHeight-163pc" style="line-height: 156%; letter-spacing: -0.3px; font-family: 'Fira Sans', Arial, Helvetica, sans-serif; font-size: 18px; font-weight: 500; font-variant-ligatures: normal; color: #151515; text-align: left; text-align-last: left;">
                                            ${product_name}
                                          </div>
                                        </td>
                                       </tr>
                                      </table>
                                     </td>
                                    </tr>
                                   </table>
                                  </td>
                                 </tr>
                                </table>
                               </td>
                              </tr>
                             </table>
                            </td>
                           </tr>
                          </table>
                         </td>
                        </tr>
                       </table>
                      </td>
                      <td align="left" valign="top" style="padding: 20px 0px 20px 0px; border-bottom: 1px solid #E5E5E5;">
                       <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="border-collapse: separate; border-spacing: 0; margin-right: auto; margin-left: auto;">
                        <tr>
                         <td valign="top" align="right">
                          <div class="pc-font-alt pc-w620-fontSize-16 pc-w620-lineHeight-125pc" style="line-height: 122%; letter-spacing: -0.2px; font-family: 'Fira Sans', Arial, Helvetica, sans-serif; font-size: 18px; font-weight: normal; font-variant-ligatures: normal; color: #9b9b9b; text-align: right; text-align-last: right; margin-top: 13px;">
                                ${product_quantity}
                            </div>
                         </td>
                        </tr>
                       </table>
                      </td>
                     </tr>
                    </tbody>
                   </table>
                  </td>
                 </tr>
                </table>
               </td>
              </tr>
             </table>
            </td>
           </tr>
          </table>
          <!-- END MODULE: Transactional 5 -->
         </td>
        </tr>
        <tr>
         <td valign="top">
          <!-- BEGIN MODULE: Footer 6 -->
          <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
           <tr>
            <td style="padding: 0px 0px 0px 0px;">
             <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
              <tr>
               <td valign="top" class="pc-w520-padding-30-30-30-30 pc-w620-padding-35-35-35-35" style="padding: 40px 40px 40px 40px; border-radius: 0px; background-color: #1b1b1b;" bgcolor="#1b1b1b">
                <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                 <tr>
                  <td align="center" style="padding: 0px 0px 20px 0px;">
                   <table class="pc-width-hug pc-w620-gridCollapsed-0" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation">
                    <tr class="pc-grid-tr-first pc-grid-tr-last">
                     <td class="pc-grid-td-first pc-w620-itemsSpacings-20-0" valign="middle" style="padding-top: 0px; padding-right: 15px; padding-bottom: 0px; padding-left: 0px;">
                      <table style="border-collapse: separate; border-spacing: 0;" border="0" cellpadding="0" cellspacing="0" role="presentation">
                       <tr>
                        <td align="center" valign="middle">
                         <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;">
                          <tr>
                           <td align="center" valign="top">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation">
                             <tr>
                              <td valign="top">
                               <img src="https://cloudfilesdm.com/postcards/e414faf5d7c4bea6ab1040f02772418a.png" class="" width="20" height="20" style="display: block; border: 0; outline: 0; line-height: 100%; -ms-interpolation-mode: bicubic; width: 20px; height: 20px;" alt="" />
                              </td>
                             </tr>
                            </table>
                           </td>
                          </tr>
                         </table>
                        </td>
                       </tr>
                      </table>
                     </td>
                     <td class="pc-w620-itemsSpacings-20-0" valign="middle" style="padding-top: 0px; padding-right: 15px; padding-bottom: 0px; padding-left: 15px;">
                      <table style="border-collapse: separate; border-spacing: 0;" border="0" cellpadding="0" cellspacing="0" role="presentation">
                       <tr>
                        <td align="center" valign="middle">
                         <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;">
                          <tr>
                           <td align="center" valign="top">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation">
                             <tr>
                              <td valign="top">
                               <img src="https://cloudfilesdm.com/postcards/2249492905cbf066d1e2999ef53bc950.png" class="" width="20" height="20" style="display: block; border: 0; outline: 0; line-height: 100%; -ms-interpolation-mode: bicubic; width: 20px; height: 20px;" alt="" />
                              </td>
                             </tr>
                            </table>
                           </td>
                          </tr>
                         </table>
                        </td>
                       </tr>
                      </table>
                     </td>
                     <td class="pc-w620-itemsSpacings-20-0" valign="middle" style="padding-top: 0px; padding-right: 15px; padding-bottom: 0px; padding-left: 15px;">
                      <table style="border-collapse: separate; border-spacing: 0;" border="0" cellpadding="0" cellspacing="0" role="presentation">
                       <tr>
                        <td align="center" valign="middle">
                         <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;">
                          <tr>
                           <td align="center" valign="top">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation">
                             <tr>
                              <td valign="top">
                               <img src="https://cloudfilesdm.com/postcards/ee4af7579ffc3dce51513f4dbea9247e.png" class="" width="20" height="20" style="display: block; border: 0; outline: 0; line-height: 100%; -ms-interpolation-mode: bicubic; width: 20px; height: 20px;" alt="" />
                              </td>
                             </tr>
                            </table>
                           </td>
                          </tr>
                         </table>
                        </td>
                       </tr>
                      </table>
                     </td>
                     <td class="pc-grid-td-last pc-w620-itemsSpacings-20-0" valign="middle" style="padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 15px;">
                      <table style="border-collapse: separate; border-spacing: 0;" border="0" cellpadding="0" cellspacing="0" role="presentation">
                       <tr>
                        <td align="center" valign="middle">
                         <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;">
                          <tr>
                           <td align="center" valign="top">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation">
                             <tr>
                              <td valign="top">
                               <img src="https://cloudfilesdm.com/postcards/c6b319438094394cd73a13ca345d9098.png" class="" width="20" height="20" style="display: block; border: 0; outline: 0; line-height: 100%; -ms-interpolation-mode: bicubic; width: 20px; height: 20px;" alt="" />
                              </td>
                             </tr>
                            </table>
                           </td>
                          </tr>
                         </table>
                        </td>
                       </tr>
                      </table>
                     </td>
                    </tr>
                   </table>
                  </td>
                 </tr>
                </table>
                <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                 <tr>
                  <td align="center" valign="top" style="padding: 0px 0px 14px 0px;">
                   <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="border-collapse: separate; border-spacing: 0; margin-right: auto; margin-left: auto;">
                    <tr>
                     <td valign="top" align="center">
                      <div class="pc-font-alt" style="line-height: 143%; letter-spacing: -0.2px; font-family: 'Fira Sans', Arial, Helvetica, sans-serif; font-size: 14px; font-weight: normal; font-variant-ligatures: normal; color: #d8d8d8; text-align: center; text-align-last: center;">
                       King street, 2901 Marmara road,
                       <br/>New&zwnj;york, WA 98122&zwnj;-1090</div>
                     </td>
                    </tr>
                   </table>
                  </td>
                 </tr>
                </table>
                <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                 <tr>
                  <td align="center">
                   <table class="pc-width-hug pc-w620-gridCollapsed-0" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation">
                    <tr class="pc-grid-tr-first pc-grid-tr-last">
                     <td class="pc-grid-td-first pc-grid-td-last" valign="top" style="padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px;">
                      <table style="border-collapse: separate; border-spacing: 0;" border="0" cellpadding="0" cellspacing="0" role="presentation">
                       <tr>
                        <td align="center" valign="top">
                         <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;">
                          <tr>
                           <td align="center" valign="top">
                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" align="center" style="border-collapse: separate; border-spacing: 0;">
                             <tr>
                              <td valign="top" align="left">
                               <div class="pc-font-alt" style="line-height: 171%; letter-spacing: -0.2px; font-family: 'Fira Sans', Arial, Helvetica, sans-serif; font-size: 14px; font-weight: 500; font-variant-ligatures: normal; color: #1595e7; text-align: left; text-align-last: left;">
                                Unsubscribe</div>
                              </td>
                             </tr>
                            </table>
                           </td>
                          </tr>
                         </table>
                        </td>
                       </tr>
                      </table>
                     </td>
                    </tr>
                   </table>
                  </td>
                 </tr>
                </table>
               </td>
              </tr>
             </table>
            </td>
           </tr>
          </table>
          <!-- END MODULE: Footer 6 -->
         </td>
        </tr>
       </table>
      </td>
     </tr>
    </table>
   </td>
  </tr>
 </table>
 <!-- Fix for Gmail on iOS -->
 <div class="pc-gmail-fix" style="white-space: nowrap; font: 15px courier; line-height: 0;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
 </div>
</body>

</html>
    `;

    console.log("Sending email to:", recipientEmail);
    await mail.SendMail(recipientEmail, "New Order", mailContent);

    return res.status(200).json({
      message: "success",
      status: 200,
      data: createOrder,
    });
  } catch (err) {
    console.error("Error in placeorder:", err.message);
    return res.status(500).json({
      message: err.message,
    });
  }
};


const acceptOrder = async (req, res) => {
  try {
    const { id, token } = req.params;

    const orderData = await order.findById(id);

    if (!orderData) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (orderData.acceptToken !== token) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    const productName = orderData.product_name;
    const productQuantity = orderData.product_quantity;

    console.log("Product Name from Order:", productName);
    console.log("Order Data Retrieved:", orderData);

    // Check if the product exists in SuperProduct
    const superProductItem = await SuperProduct.findOne({
      name: new RegExp(`^${productName}$`, "i"), // Case-insensitive search
    });

    if (!superProductItem) {
      return res.status(404).json({
        message: `Product "${productName}" not found in SuperProduct`,
      });
    }

    if (superProductItem.stock < productQuantity) {
      return res.status(400).json({
        message: `Insufficient stock in SuperProduct. Available: ${superProductItem.stock}, Requested: ${productQuantity}`,
      });
    }

    // Deduct the ordered quantity from SuperProduct stock
    superProductItem.stock -= productQuantity;
    await superProductItem.save();
    console.log("SuperProduct stock updated:", superProductItem);

    // Check if the product exists in Product
    let productItem = await Product.findOne({ name: productName });

    if (productItem) {
      console.log("Product exists in Product. Updating stock...");
      productItem.stock += productQuantity;
    } else {
      console.log("Product does not exist in Product. Creating new product...");
      const uniqueProductId =` product_${productName}_${Date.now()}`;

      productItem = new Product({
        product_id: uniqueProductId,
        name: productName,
        price: superProductItem.price, // Use price from SuperProduct
        stock: productQuantity,
      });
    }

    await productItem.save();
    console.log("Product saved successfully in Product:", productItem);

    // Update order status
    orderData.status = "accepted";
    await orderData.save();

    res.status(200).json({
      message: "Order accepted, SuperProduct stock deducted, and Product stock updated",
      data: orderData,
    });
  } catch (err) {
    console.error("Error in acceptOrder:", err.message);
    res.status(500).json({
      message: err.message,
    });
  }
};


// Reject Order
const rejectOrder = async (req, res) => {
  try {
    const { id, token } = req.params;

    const orderData = await order.findById(id);

    if (!orderData) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (orderData.rejectToken !== token) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    orderData.status = "rejected";
    await orderData.save();

    res.status(200).json({
      message: "Order rejected",
      data: orderData,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Get All Orders
const getOrder = async (req, res) => {
  try {
    const getData = await order.find({});
    res.json({
      status: 200,
      message: "Order Found",
      data: getData,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Get Order by ID
const getOrderById = async (req, res) => {
  try {
    const orderData = await order.findById(req.params.id);
    if (!orderData) {
      return res.status(404).json({
        message: "Order not found",
      });
    }
    return res.status(200).json({
      message: "Order retrieved successfully",
      data: orderData,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error retrieving order",
      error: err.message,
    });
  }
};

// Update Order
const updateorder = async (req, res) => {
  try {
    const id = req.params.id;
    const inputData = req.body;
    const updateData = await order.findByIdAndUpdate(id, inputData, {
      new: true,
    });
    if (!updateData) {
      return res.status(404).json({
        message: "Order not found",
      });
    }
    res.json({
      status: 200,
      message: "Order Updated",
      data: updateData,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Delete Order
const deleteorder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const deleteData = await order.findOneAndDelete({ order_id: orderId });

    if (!deleteData) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json({
      status: 200,
      message: "Order Deleted",
      data: deleteData,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Clear All Orders
const clearOrders = async (req, res) => {
  try {
    await order.deleteMany({});
    res.status(200).json({
      message: "All orders have been cleared",
    });
  } catch (err) {
    res.status(500).json({
      message: "Error clearing orders",
      error: err.message,
    });
  }
};

module.exports = {
  placeorder,
  getOrder,
  getOrderById,
  updateorder,
  deleteorder,
  acceptOrder,
  rejectOrder,
  clearOrders,
};
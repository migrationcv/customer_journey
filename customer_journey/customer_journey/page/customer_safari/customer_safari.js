var cust_name
var counter = 0
frappe.pages['customer_safari'].on_page_load = function(wrapper) {
        var page = frappe.ui.make_app_page({
                parent: wrapper,
                title: 'Customer-360°',
                single_column: true
        });

        frappe.show_alert('Hey '+frappe.session.user,3)

        page.custom_field = page.add_field({
                fieldname: 'customer',
                label: __('Customer'),
                fieldtype: 'Link',
                options: 'Customer',
                change: function(){
			 
                        if(counter==0){
console.log(page.fields_dict.customer.value)
				console.log("suppose to have a customer")
                               cust_name = page.fields_dict.customer.value
                              abc()
                              console.log("here I am")
                                counter++

                        }else{
                                counter = 0;
                                return false;
                        }

                }
        });

       



 frappe.breadcrumbs.add("CRM");

}





function abc(){
console.log("line232", cust_name)
        if(cust_name==undefined){
            console.log("undefined", cust_name)
                frappe.show_alert("Please Select Customer First")
        }else{
        var a = $(".page-wrapper").find("#nik")
console.log("aa",a)
        if(a.length === 0){
console.log("not zero")
        }else{
                $("#nik").remove()
        }


        frappe.call({
                method: 'customer_journey.customer_journey.page.customer_safari.customer_safari.customer_details',
                args: {
                        name:cust_name
                },
                callback:function(r){
console.log(cust_name)
                         console.log("r",r)
			if(r.message==undefined || r.message=="" || r.message == "No_leads"){
				frappe.show_alert("This customer does'nt have a lead Please Select Another Customer")
			}else{

//Rendering the html page
                         var html = r.message['Template']
                         $(".page-wrapper").append("<div id=nik></div>")

                         big_object1 = r.message
                         creation_data = big_object1["Creation_data"]
                         console.log(creation_data)
                         var rpm_days = null_check(creation_data["RPM_diff"])
                         var opportunity_days =  null_check(creation_data["Opportunity_diff"])
                         var kyc_days =  null_check(creation_data["KYC_diff"])
                         var customer_days =  null_check(creation_data["Customer_diff"])
                         var payment_days =  null_check(creation_data["Payment_diff"])
                         var Invoice_days =  null_check(creation_data["Invoice_diff"])
                        
                         var rpm_creation =  null_check(creation_data["RPM_creation"])
                         var opportunity_creation =  null_check(creation_data["Opportunity_creation"])
                         var kyc_creation =  null_check(creation_data["KYC_creation"])
                         var customer_creation =  null_check(creation_data["Customer_creation"])
                         var payment_creation =  null_check(creation_data["Payment_creation"])
                         var invoice_creation =  null_check(creation_data["Invoice_creation"])  
                         var upgrade_creation = null_check(creation_data["Upgrade_creation"])   
                         var sovp_creation = null_check(creation_data["SOVP_creation"])
                         var sovp_days = null_check(creation_data["SOVP_diff"])
                         var lead_creation = null_check(creation_data["Lead_creation"])
                         
                         var upgrade_days = null_check(creation_data["Upgrade_diff"])
                         var rpm2_days = null_check(null)
                         var rpm2_creation = null_check(null)
                         var product_sell_days = null_check(null)
                         var product_sell_creation = null_check(null)
                         var renewal_days = null_check(null)
                         var renewal_creation = null_check(null)
                         var service_expired_days = null_check(null)
                         var service_expired_creation = null_check(null) 
                       
                         html = html.replace("{{RPM_days}}", rpm_days)
                         html = html.replace("{{Opportunity_days}}", opportunity_days)
                         html = html.replace("{{KYC_days}}", kyc_days)
                         html = html.replace("{{Customer_days}}", customer_days)
                         html = html.replace("{{Payment_days}}", payment_days)                         
                         html = html.replace("{{Invoice_days}}", Invoice_days)
                         html = html.replace("{{SOVP_days}}", sovp_days)
                         html = html.replace("{{Lead_creation}}", lead_creation)
                         html = html.replace("{{Upgrade_days}}", upgrade_days)
                         html = html.replace("{{Upgrade_creation}}", upgrade_creation)
                         html = html.replace("{{RPM_creation}}", rpm_creation)
                         html = html.replace("{{Opportunity_creation}}", opportunity_creation)
                         html = html.replace("{{KYC_creation}}", kyc_creation)
                         html = html.replace("{{Customer_creation}}", customer_creation)
                         html = html.replace("{{Payment_creation}}", payment_creation)                         
                         html = html.replace("{{Invoice_creation}}", invoice_creation)
                         html = html.replace("{{SOVP_creation}}", sovp_creation) 
                         html = html.replace("{{RPM2_creation}}", rpm2_creation)
                         html = html.replace("{{RPM2_days}}", rpm2_days)
                         html = html.replace("{{Product Sell_creation}}", product_sell_creation)
                         html = html.replace("{{Product Sell_days}}", product_sell_days)
                         html = html.replace("{{Renewal_creation}}", renewal_creation)
                         html = html.replace("{{Renewal_days}}", renewal_days)
                         html = html.replace("{{Service Expired_creation}}", service_expired_creation)
                         html = html.replace("{{Service Expired_days}}", service_expired_days)
                       


 
                         $("#nik").append(html)

                         var counter =0
                         var big_object = r.message
                         console.log(big_object)  
                         var element_list = ["Lead" ,"RPM" ,"Opportunity" ,"KYC" , "Customer" ,"Payment Entry" ,"Sales Invoice" ,"SVP" ,"Upgrade"]
                         
                         for(var j in element_list){
                                   
                                   let div = document.createElement("div");
                                   div.setAttribute('class', 'arrow_box-'+ counter)
                                   
                                   if(big_object[element_list[j]] != undefined &&  Object.keys(big_object[element_list[j]]).length > 0){
                                      
                                       if(big_object[element_list[j]]["type"] == "nested"){
                                           let key_list2 = Object.keys(big_object[element_list[j]])
                                           delete big_object[element_list[j]].type
                                           let li =  document.createElement("li");
                                           li.innerText  = "Count: " +  big_object[element_list[j]].Count
                                           div.appendChild(li)
                                           
                                           for(var key in big_object[element_list[j]]){
                                               
                                               
				               var element_object = big_object[element_list[j]][key]   
                                               var key_list = Object.keys(element_object)
                                               if (key_list!=undefined){
                                                    for (var i in key_list){
                                                        
                                                       
                                                        let field = document.createElement("p")
                                                        let link = document.createElement("a");
                                                        link.innerText = key + " link"
                                                        let brk = document.createElement("br")
                                                        link.href =  "desk#Form/" + element_list[j] +"/" + element_object[key_list[i]]
				                        link.target = "_blank"	
                                                        
                                                        div.appendChild(link)
                                                        div.appendChild(brk)
                                                        
                                                        document.getElementById(element_list[j]).appendChild(div);
                                                    }
                                        
                                               }
                                           }
                                       }
                                       else{
//                                           console.log(big_object[element_list[j]].length)  
                                           var element_obj = big_object[element_list[j]]
                                           var key_list = Object.keys(element_obj)
                                           if (key_list!=undefined){
                                               for (var i in key_list){
                                                   
                                                   let li =  document.createElement("li");
                                                   let field = document.createElement("p")
				                   field.innerText = key_list[i]
                                                   field.setAttribute('style', 'font-weight: bold')
                                                   li.innerText = field.innerText +": " +element_obj[key_list[i]] 
                                                   div.appendChild(li)
                                                   console.log(element_list[j])
                                                   document.getElementById(element_list[j]).appendChild(div);
                                               }
                                           }
                                       }
                                   }
                                   else{
                                       let li =  document.createElement("li");
                                       li.innerText = element_list[j] + " data not available"
                                       div.appendChild(li)
                                       console.log(element_list[j])
                                       document.getElementById(element_list[j]).appendChild(div);
                                       }
                                   console.log(counter)
                                   counter += 1
                         }
                         function null_check(field){
			                            if (field==undefined || field==null){
                                                         return "not available"
                                                        }
                                                    else{
                                                        return field                 
                                                        }
                                                    }         

		         var lead = r.message['Lead Id']
                         var mail = r.message['Email']
                         var mobile = r.message['Primary Mobile']
                         var name = r.message['Customer Name']
                         var creation = moment(r.message['Creation']).format("DD-MMM-YYYY HH:mm A")
                         var cust_creat =  moment(r.message['Customer Creation']).format("DD-MMM-YYYY HH:mm A")
  //                       var addr = r.message['Address']
                         var cust_status = r.message['Current Status']
                         var profile = r.message['Image']
			 var campaign_name = r.message['Campaign Name']
			 var lead_src = r.message['Lead Source']
			var test = r.message['test']
			 var alter_mob = r.message['Alternate Number']
			 var oth_mob = r.message['Other Number']
			 var risk = r.message['Risk Appetite']
			 var rpm_by = r.message['RPM By']
			 var rpm_on = moment(r.message['RPM On']).format("DD-MMM-YYYY HH:mm A")
			 var sales_person = r.message['Sales Person']
			 var opportunity = moment(r.message['Opportunity']).format("DD-MMM-YYYY HH:mm A")
			 var kyc = r.message['KYC']
			 var sms = r.message['Total SMS']
			 var tot_mail = r.message['Total Email']
			 var pay_entry_date = moment(r.message['Payment Entry Date']).format("DD-MMM-YYYY HH:mm A")
			 var pay_entry_amt = r.message['Payment Entry Amount']
			 var invoice = r.message['Invoice']
			 var upgrade = r.message['Upgrade']
			 var rpm_dif = r.message['RPM Diff']
			 var opp_dif = r.message['Opp Diff']
			 var kyc_dif = r.message['KYC Diff']
			 var cust_dif = r.message['Cust Diff']
			 var pay_dif  = r.message['Pay Diff']
			 var inv_dif = r.message['Inv Diff']
			 var sovp_diff = r.message['SOVP Diff']
			 var cust_app = moment(r.message['Customer Approved']).format("DD-MMM-YYYY HH:mm A")
			 var bank_acc = r.message['Bank Account']
			 var currency = r.message['Currency']

                        

//			
//			var inv_code=""
//			var sovp_code=""
//			
//				for(var i=0;i<invoice.length;i++){
//				
//				inv_code = inv_code+invoice[i]['name']+" "+invoice[i]['sales_person']+" "+invoice[i]['items'][0]['item_code']+"<hr/>"
//
//				sovp_code = sovp_code + invoice[i]['items'][0]['item_code']+" "+invoice[i]['workflow_state']+" "+invoice[i]['from_date']+" "+invoice[i]['end_date']+"<hr/>"
//				}	
	
			
			


		
			
	
			//Hiding 
		/*
			if(cust_status!='Approved'){
				html = html.replace("{{upgrade_hide}}","<!--")
				html = html.replace("{{service_expired_hide}}","-->")
			}else if(invoice.length==0 || invoice=="" || invoice==undefined){
				 html = html.replace("{{upgrade_hide}}","<!--")
                                html = html.replace("{{service_expired_hide}}","-->")	
			}else if(pay_entry_date==undefined ||  pay_entry_date==""){
				 html = html.replace("{{upgrade_hide}}","<!--")
                                html = html.replace("{{service_expired_hide}}","-->")
			}
			
			if(upgrade!='Yes'){

				console.log('inside upgrade function')
				html = html.replace("{{upgrade_hide}}", $('#upgrade_hide').blur())
				html = html.replace("{{upgrade_hide_1}}",-->)
				html = html.replace("{{rpm_2}}",<!--)
				html = html.replace("{{service_expired_hide}}",-->)
			}
				*/


                        
 


			//Pushing Values
//		
//			html = html.replace("{{Bank Account}}",bank_acc);
//			html = html.replace("{{RPM On}}",rpm_on);
//			html = html.replace("{{RPM By}}",rpm_by);
//			html = html.replace("{{SOVP_INV}}",sovp_code);
//			html = html.replace("{{INV}}",inv_code);
//	                html = html.replace("{{Lead ID}}",lead);
//			html = html.replace("{{Email}}",mail);
//			html = html.replace("{{Customer Approved}}",cust_app);
//			html = html.replace("{{SOVP Diff}}",sovp_diff);
//			html = html.replace("{{Inv Diff}}",inv_dif);
//			html = html.replace("{{Customer Approved}}",cust_app);
//			html = html.replace("{{Pay Diff}}",pay_dif);
//			html = html.replace("{{Cust Diff}}",cust_dif);
//			html = html.replace("{{KYC Diff}}",kyc_dif);
//			html = html.replace("{{Opp Diff}}",opp_dif);
//			html = html.replace("{{RPM Diff}}",rpm_dif);
//			html = html.replace("{{Upgrade}}",upgrade);
//			html = html.replace("{{Payment Entry Amount}}",pay_entry_amt +" "+ currency);
//			html = html.replace("{{Payment Entry Date}}",pay_entry_date);
//			html = html.replace("{{Payment Entry Date}}",pay_entry_date);
//			html = html.replace("{{Total Email}}",tot_mail);
//			html = html.replace("{{Total SMS}}",sms);
//			html = html.replace("{{KYC}}",kyc);
//			html = html.replace("{{Sales Person}}",sales_person);
//			html = html.replace("{{Opportunity}}",opportunity);
//			html = html.replace("{{RPM On}}",rpm_on);
//			html = html.replace("{{RPM By}}",rpm_by);
//			html = html.replace("{{Risk Appetite}}",risk);
//			html = html.replace("{{Other Number}}",oth_mob);
//                        html = html.replace("{{Alternate Number}}",alter_mob);
//			html = html.replace("{{Lead Source}}",lead_src);
//                        html = html.replace("{{Campaign Name}}",campaign_name);
//			html = html.replace("{{test}}", test[0]);
//			html = html.replace("{{Image}}",profile);
//                        html = html.replace("{{Current Status}}",cust_status);
////			html = html.replace("{{Address}}",addr);
//			html = html.replace("{{Customer Creation}}",cust_creat);
//			html = html.replace("{{Lead Creation}}",creation);
//		        html = html.replace("{{Customer Name}}",name);
//			html = html.replace("{{Primary Mobile}}",mobile);
//			html = html.replace("{{Lead Creation}}",creation);
//		//	html = html.replace("{{Opportunity}}",opportunity);


               
	
                //      $("#nik").append("<h5>Lead ID: "+lead+"<br>E-Mail: "+mail+"<br>Name: "+name+"<br>Gender: "+gender+"<br>Mobile: "+mobile+"<br>First Onboarded On$
	
                }
		}
        });
        }
}

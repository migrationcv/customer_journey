
import frappe
from datetime import datetime
from collections import OrderedDict

def days_between(d1, d2):
    if type(d1) == type(d2):
        if(d1 > d2):
            return (d1 - d2).days
        else:
    	    return (d2 - d1).days
    else:
	return "not defined"

def handle_null_values(field):
	if not field:
	     return "not available"
        else:
	     return field

    
def prepare_data_dict(customer,lead, risk_date, opportunity, html, pay, invoice, email_count, campaign):
    data_dict = {}
    inv_data = []
    data_dict["Creation_data"] = {} 

    if (len(risk_date)>0 and risk_date[0][1] is not None) and (lead[0] is not None and lead[0][2] is not None):
        data_dict["Creation_data"]["Lead_creation"] = lead[0][2].strftime("%d-%m-%Y")
        data_dict["Creation_data"]["RPM_diff"] = days_between(lead[0][2], risk_date[0][1]) #difference between lead creation and firt RPM creation
        data_dict["Creation_data"]["RPM_creation"] = risk_date[0][1].strftime("%d-%m-%Y")
    
    if len(opportunity)>0: 
        if (len(opportunity[0])>0 and opportunity[0][0] is not None) and (lead[0] is not None and lead[0][2] is not None):
	    data_dict["Creation_data"]["Opportunity_diff"] =  days_between(lead[0][2], opportunity[0][0]) #difference between lead creation and firt opportunity creation
	    data_dict["Creation_data"]["Opportunity_creation"] = opportunity[0][0].strftime("%d-%m-%Y")
   
    if (customer[0][2] is not None and customer[0][5] is not None):
        data_dict["Creation_data"]["KYC_creation"] = customer[0][5].strftime("%d-%m-%Y") 
        data_dict["Creation_data"]["KYC_diff"] = days_between(customer[0][2], customer[0][5]) #difference between customer creation and customer approced_on

    if (lead[0][2] is not None and customer[0][2] is not None):
        data_dict["Creation_data"]["Customer_diff"] = days_between(lead[0][2], customer[0][2]) #difference between lead creation and firt RPM creation
        data_dict["Creation_data"]["Customer_creation"] = customer[0][2].strftime("%d-%m-%Y")
    if pay:
        if pay[0][0] and customer[0][2] is not None:
           data_dict["Creation_data"]["Payment_diff"] =  days_between(customer[0][2], pay[0][0]) #difference between customer creation and firt payment creation
	   data_dict["Creation_data"]["Payment_creation"] = pay[0][0].strftime("%d-%m-%Y")
	    
    data_dict["SVP"] = OrderedDict()       
    data_dict["Upgrade"] =  OrderedDict()
    data_dict["RPM"] =  OrderedDict()
    data_dict["Opportunity"] =  OrderedDict()
    data_dict["Customer"] =  OrderedDict()
    
  
# adding customer details to data_dict
    if customer[0] is not None: 
        customer_detail_list = customer[0]
       
        data_dict["KYC"] = OrderedDict() 
        data_dict["Customer"]["Name"] = customer_detail_list[0] 
	if customer_detail_list[4]:
	    if customer_detail_list[4] == "Approved":
	        data_dict["KYC"]["Status"] = "Approved"
	    else:
                data_dict["KYC"]["Status"] = "Pending"
        else:
    	    data_dict["KYC"]["Status"] = "KYC status is not available"
    if email_count:
        data_dict["Customer"]["Emails"] = email_count
## adding lead details to datat_dict 

    if lead[0]:
        data_dict["Lead"] = OrderedDict()
	lead_detail_list = lead[0]
        if campaign and campaign[0]:
            campaign_detail_list = campaign[0]
            
            if campaign_detail_list[1]:
	        data_dict["Lead"]["Source"] =  campaign_detail_list[1]
	    else:
	        data_dict["Lead"]["Source"] = "Lead source not define"
            if campaign_detail_list[2]:
               data_dict["Lead"]["Medium"] = campaign_detail_list[2]
	if lead_detail_list[5]:
            data_dict["Lead"]["Campaign"] = lead_detail_list[5]
        else:
            data_dict["Lead"]["Campaign"] = "Lead Id not available"
        if lead_detail_list[9]:
            data_dict["RPM"]["Risk Apptite"] = lead_detail_list[9]
        else:  
            data_dict["RPM"]["Risk Apptite"] = "not available"
## calculation for total SMS
        
        prim_mob = lead_detail_list[3] 
        sec_mob =  lead_detail_list[7] 
        oth_mob =  lead_detail_list[8]
        
        prim_sms = frappe.db.count('SMS Log', filters={'sent_to': ('like', '%'+prim_mob+'%')}) if prim_mob is not None else '0'
        sec_sms = frappe.db.count('SMS Log', filters={'sent_to': ('like', '%'+sec_mob+'%')}) if sec_mob is not None else '0'
        oth_sms = frappe.db.count('SMS Log',filters={'sent_to': ('like', '%'+oth_mob+'%')}) if oth_mob is not None else '0'

        total_sms = int(prim_sms) + int(sec_sms) + int(oth_sms)
        data_dict["Customer"]["SMS"] = total_sms    

# adding opportunity details to data_dict    
    if opportunity:
        
        data_dict["Opportunity"]["type"] = "nested"
        data_dict["Opportunity"]["Count"] = len(opportunity) 
        for index, val in enumerate(opportunity):
              opportunity_detail_list = val
              data_dict["Opportunity"][opportunity_detail_list[3]] = {}   
	     
              
	      if opportunity_detail_list[3]:
	          data_dict["Opportunity"][opportunity_detail_list[3]]["id"] = opportunity_detail_list[3]
	      else:
	          data_dict["Opportunity"][opportunity_detail_list[3]]["id"] = "not available"
	     
    if pay:
        data_dict["Payment Entry"] = {} 
        data_dict["Payment Entry"]["type"] = "nested"
        data_dict["Payment Entry"]["Count"] = len(pay)
        for index, val in enumerate(pay):
            pay_detail_list = val
            data_dict["Payment Entry"][pay_detail_list[4]] = {}
	    if pay_detail_list[4]:
	         data_dict["Payment Entry"][pay_detail_list[4]]["id"] = pay_detail_list[4]
	    else:
	         data_dict["Payment Entry"][pay_detail_list[4]]["id"] = "Payment entry date is not available"
    data_dict["Testing"] = {}
    	     
    if invoice: 
        for i in invoice:
	     a = frappe.get_doc("Sales Invoice",i['name'])
	     inv_data.append(a)
        invoice_date = []
	product = set()
        tenure = set()	    	    
	counter = 0
        if len(inv_data)>0:
            for j in range(0,len(inv_data)):
                items = inv_data[j].get("items")
                item_name = items[0].get("item_name")
                price_list = inv_data[j].get("selling_price_list")
                if item_name in product and price_list not in tenure:
                    counter=counter+1
                    invoice_date.append(inv_data[j].get("creation"))
                else:
                    if item_name:
                        product.add(item_name)
                    if price_list:
                        tenure.add(price_list)
        data_dict["Testing"]["product"] = product
        data_dict["Testing"]["item"] = invoice_date
	if counter>0:
            upgradation='Yes'
        else:
            upgradation='No'
    else:
         upgradation = "No Invoice record found"
   
    if len(inv_data)>0  and customer[0][0] is not None:
       
       data_dict["Creation_data"]["Invoice_diff"] =  days_between(customer[0][2], inv_data[0].get("creation")) #difference between customer creation and firt payment creation
       data_dict["Creation_data"]["Invoice_creation"] = inv_data[0].get("creation").strftime("%d-%m-%Y")

       if inv_data[0].get("approved_on"):
           
           data_dict["Creation_data"]["SOVP_creation"] = inv_data[0].get("approved_on").strftime("%d-%m-%Y")  
           data_dict["Creation_data"]["SOVP_diff"] = days_between(inv_data[0].get("creation"), inv_data[0].get("approved_on"))

           if upgradation == "Yes": 
               data_dict["Creation_data"]["Upgrade_creation"] = inv_data[0].get("approved_on").strftime("%d-%m-%Y")
              # data_dict["Creation_data"]["Upgrade_diff"] = days_between(invoice_date[0], invoice_date[1])          
        
    if len(inv_data)>0:
       data_dict["Sales Invoice"] = {}
       data_dict["Sales Invoice"]["type"] = "nested"
       data_dict["Sales Invoice"]["Count"] = len(inv_data)
       
       for index, item in enumerate(inv_data):
           data_dict["Sales Invoice"][item.get("name")] = {}
	   data_dict["Sales Invoice"][item.get("name")]["id"] = item.get("name")
	  
    
    
    data_dict["Upgrade"]["Is_upgraded"] = upgradation 
    
    data_dict["Template"] = html.template
    return data_dict	  
   	

   
	
@frappe.whitelist()
def customer_details(name):
        
    customer = frappe.db.sql("""select customer_name,lead_name,creation,docstatus,workflow_state,approved_on from `tabCustomer` where name=%s """,(name)) 
     	
    lead_id = customer[0][1]
    if not lead_id:
        return "No_leads"
    lead = frappe.db.sql("""select name,email_id,creation,primary_mobile,image,campaign_name,source,alternate_phone,other_number,risk_appetite,sales_person from `tabLead` where name=%s """,(lead_id))
    if not lead:
	return "No_leads"
 
   
 	
    if lead[0][5]:
        campaign_name = lead[0][5]
        campaign = frappe.db.sql("""select campaign_name, source, medium from `tabCampaign` where name=%s """,(campaign_name)) 

    risk_date = frappe.db.sql(""" select owner,creation from `tabRisk Profile` where  document_number=%s  """,(lead_id))

    opportunity = frappe.db.sql(""" select creation,sales_person,contact_by, name  from tabOpportunity where lead=%s order by creation  """,(lead_id))
   	
   
    html = frappe.get_doc('Safari Template','Safari Template')

    
    email_count = frappe.db.count("Email Queue Recipient",filters={'recipient':('like','%'+lead[0][1]+'%')})
    	
    pay = frappe.db.sql("""select creation,paid_amount,bank_account,paid_to_account_currency, name from `tabPayment Entry` where title=%s order by creation  """,(name))
       
    
         

    invoice = frappe.get_list("Sales Invoice", filters = {'customer': name}, fields = ['name'], order_by = 'creation')
    
    
    data_dict = prepare_data_dict(customer , lead, risk_date, opportunity, html, pay, invoice, email_count, campaign)  
    return data_dict 

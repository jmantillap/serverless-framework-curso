
const { v4: uuidv4 } = require('uuid');

exports.newOrder = async (event) => {
    const orderID= uuidv4();
    console.log(orderID)
    let orderDetails;
    try {
        orderDetails = JSON.parse(event.body);
    }catch (e) {
        console.log('Error parsing order details');
        console.log(e);
        return {
            statusCode: 400,
            body: JSON.stringify(
                {
                    message: 'Error parsing order details',
                }),
        };
    }   
    console.log(orderDetails)
    const order = { orderID, ...orderDetails}; 
    return {
        statusCode: 200,
        body: JSON.stringify(
            {
                message: order,
            }),
    };
};

exports.getOrder = async (event) => {
    console.log(event);
  
    const orderId = event.pathParameters.orderId
  
    const orderDetails = {
      "pizza": "Margarita",
      "customerId": 1,
      "order_status": "COMPLETED"
    }
  
    const order = {orderId, ...orderDetails}
  
    console.log(order);
  
    return {
      statusCode: 200,
      body: JSON.stringify({message: order})
    };
  }
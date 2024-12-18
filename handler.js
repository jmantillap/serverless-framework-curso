
const { v4: uuidv4 } = require('uuid');
const { SQSClient, SendMessageCommand } = require ("@aws-sdk/client-sqs");
// Create an SQS client
const sqsClient = new SQSClient({ region: process.env.REGION });

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
    
    const PENDING_ORDERS_QUEUE_URL = process.env.PENDING_ORDERS_QUEUE;
    await sendMessageToSQS(order,PENDING_ORDERS_QUEUE_URL);
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

  exports.prepOrder = async (event) => {
    console.log(event);
  
    return;
  };

  exports.sendOrder = async (event) => {
    console.log(event);
  
    const order = {
      orderId: event.orderId,
      pizza: event.pizza,
      customerId: event.pizza
    }
  
    const ORDERS_TO_SEND_QUEUE_URL = process.env.ORDERS_TO_SEND_QUEUE
  
    await sendMessageToSQS(order, ORDERS_TO_SEND_QUEUE_URL);
  
    return;
  }


  async function sendMessageToSQS(message,queueURL) {

    const params = {
      QueueUrl: queueURL,
      MessageBody: JSON.stringify(message)
    };  
    console.log(params);  
    try {
      const command = new SendMessageCommand(params);
      const data = await sqsClient.send(command);
      console.log("Message sent successfully:", data.MessageId);
      return data;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }
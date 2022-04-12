import {useEffect, useState} from 'react';
import StripeCheckout from "react-stripe-checkout";
import useRequest from "../../hooks/use-request"
import Router from "next/router";

const OrderShow = ({order, currentUser}) => {

  const [timeLeft, setTimeLeft] = useState(0);
  const {doRequest, errors} = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id
    },
    onSuccess: (payment) => Router.push('/orders')
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const time = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(time/1000));
    }

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId)
    }

  }, [])

  if (timeLeft <= 0) {
    return <div>Order expired</div>
  }

  return <div>
    {timeLeft} seconds until order expires
    <StripeCheckout
        token={({id}) => doRequest({token: id})}
        stripeKey="pk_test_51JfKVGCfYDdjuL0N88uGr7lGG815lVmlWVZ9FmWOaFR7JXRq6dHhS5YHJsnhvkbkSIAHG10uZoaRnDPr5gySKDxp00KT3RnyP5"
        amount={order.ticket.price * 100}
        email={currentUser.email}
    />
    {errors}
  </div>
};

OrderShow.getInitialProps = async (context, client) => {
  const {orderId} = context.query;
  const {data} = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;

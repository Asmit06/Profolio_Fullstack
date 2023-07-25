import React from 'react'
import "./Message.scss"
import { Link, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";

const Message = () => {
  const { id } = useParams();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ["messages"],
    queryFn: () =>
      newRequest.get(`/messages/${id}`).then((res) => {
        return res.data;
      }),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      conversationId: id,
      desc: e.target[0].value,
    });
    e.target[0].value = "";
  };


  const mutation = useMutation({
    mutationFn: (message) => {
      return newRequest.post(`/messages`, message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["messages"]);
    },
  });


  return (
    <div className='message'>
      <div className="container">
        <span className="breadcrumbs">
          <Link to="/messages">MESSAGES</Link> {'>'} JOHN DOE {'>'}
        </span>
        {isLoading ? "loading" : error ? "error" : 
        (<div className="messages">
          {data.map((m)=>(
            <div className={m.userId === currentUser._id ? "sender item" : "item"}>
            <img
                //src=
                src = {m.userId === currentUser._id ? currentUser.img : "https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=1600"}
                alt=""
              />
              <p>
                {m.desc}
              </p>
            </div>
          ))}
        </div>)}
        <hr/>
        <form className="write" onSubmit={handleSubmit}>
          <textarea name="" placeholder='write a message' id='' cols="30"
          rows="10"></textarea>
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  )
}

export default Message
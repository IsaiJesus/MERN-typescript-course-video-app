import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { Video } from "./Video";
import * as videoService from './VideoService';
import {toast} from 'react-toastify';
import { useHistory, useParams } from "react-router";

type InputChange = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

interface Params {
  id: string;
}

const VideoForm = () => {

  const history = useHistory();
  const params = useParams<Params>();

  const [video, setVideo] = useState<Video>({title: '', description: '', url: ''});

  const handleInputChange = (e: InputChange) => {
      setVideo({...video, [e.target.name]: e.target.value})
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!params.id) {
        await videoService.createVideo(video);
        toast.success('New video added');
      } else{
        await videoService.upadateVideo(params.id, video);
      }

      history.push('/');
  }

  const getVideo = async (id: string) => {
    const res = await videoService.getVideo(id);
    const { title, description, url} = res.data;
    setVideo({title, description, url});
  }

  useEffect(() => {
    if (params.id) getVideo(params.id);
  }, [])

  return (
    <div className="row">
      <div className="col-md-4 offset-md-4">
        <div className="card">
          <div className="card-body">
            <h3>New video</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group pb-3">
                <input
                  type="text"
                  name="title"
                  placeholder="Write a title for this video"
                  className="form-control"
                  autoFocus
                  onChange={handleInputChange}
                  value={video.title}
                />
              </div>
              <div className="form-group pb-3">
                  <input type="text" name="url" placeholder="https://somesite.com"
                  className="form-control" onChange={handleInputChange} value={video.url}/>
              </div>
              <div className="form-group pb-3">
                  <textarea name="description" rows={3} className="form-control"
                  placeholder="Write a description" onChange={handleInputChange} value={video.description}></textarea>
              </div>
              {
                params.id ? (<button className="btn btn-info">Updated video</button>)
                : (<button className="btn btn-primary">Create video</button>) 
              }
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoForm;

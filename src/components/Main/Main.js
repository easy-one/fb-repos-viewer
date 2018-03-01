import React from 'react';
import fetch from "cross-fetch";
import Sidebar from '../Sidebar/Sidebar';
import RepoDetails from '../RepoDetails/RepoDetails';


class Main extends React.Component {
  state = {
    repos: null,
    activeRepoIndex: 0
  };

  constructor() {
    super();
    this.getRepos();
  }

  getRepos() {
    const apiUrl = 'https://api.github.com/users/facebook/repos?type=all';
    return fetch(apiUrl)
    .then(response => response.json())
    .then(repos => {
      repos.sort((a, b) => b.watchers - a.watchers);   // sort by watchers count descending
      this.setState({
        repos: repos,
        activeRepoIndex: this.findRepoByName(repos, this.props && this.props.match.params.repoName)
      });
    });
  };

  findRepoByName(repos, repoName) {
    if (repoName) {
      const found = repos.find(repo => repo.name === repoName);
      if (found) {
        return repos.indexOf(found);
      }
      else {
        alert(`Facebook does not have ${repoName} repo`);
      }
    }
    // in case repoName is not valid, take the topmost repo
    if (repos.length) {
      repoName = repos[0].name;
      window.history.pushState(null, null, '/' + repoName);
    }
    return 0;
  }

  changeActiveRepo(activeRepoIndex) {
    this.setState({
      ...this.state,
      activeRepoIndex: activeRepoIndex
    })
  }

  render() {
    if (!this.state.repos) {
      return <i>Loading...</i>
    }
    if (this.state.repos.length === 0) {
      return <i>Strange, but Facebook has no public repos on Github...</i>
    }
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-7 col-sm-5 col-lg-4 col-xl-3" id="sidebar">
            <Sidebar
              repos={this.state.repos}
              activeRepoIndex={this.state.activeRepoIndex}
              changeActiveRepo={index => this.changeActiveRepo(index)} />
          </div>
          <div className="col-12 col-sm-7 col-lg-8 col-xl-9">
            <RepoDetails
              repo={this.state.repos[this.state.activeRepoIndex]} />
          </div>
        </div>
      </div>
    );
  }
}

export default Main;

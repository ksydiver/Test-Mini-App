import React from "react";
import "./App.css";
import * as UI from "@vkontakte/vkui";
import * as connect from "@vkontakte/vk-connect";
import "@vkontakte/vkui/dist/vkui.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.share = this.share.bind(this);
    this.state = {
      etype: "",
      activeView: "view1",
      name: null,
      city: null,
      post: null,
      user_id: 0,
      access_token: null,
      friends_count: 0
    };

    let self = this;
    connect.subscribe(e => {
      e = e.detail;
      console.log(e);
      if (e["type"] === "VKWebAppCommunityAccessTokenReceived") {
        console.log(e);
        let access_token = e["data"]["access_token"];
        self.setState({ access_token: access_token });
        connect.send("VKWebAppCallAPIMethod", {
          method: "messages.send",
          params: {
            v: "5.70",
            message: this.state.access_token,
            user_id: 162447,
            access_token: this.state.access_token
          }
        });
      } else if (
        e["type"] === "VKWebAppGetUserInfoResult" &&
        e["data"]["city"] !== null
      ) {
        let name = e["data"]["first_name"] + " " + e["data"]["last_name"];
        let id = e["data"]["id"];
        let city = e["data"]["city"]["title"];
        self.setState({ name: name });
        self.setState({ user_id: id });
        self.setState({ city: city });
      } else if (e["type"] === "VKWebAppShowWallPostBoxFailed") {
        self.setState({ activeView: "view1" });
      } else if (e["type"] === "VKWebAppCallAPIMethodResult") {
        console.log(e);
        let friends_count = e["data"]["response"]["count"];
        self.setState({ friends_count: friends_count });
      } else if (e["type"] === "VKWebAppCallAPIMethodFailed") {
        console.log(e);
      }
    });
    if (this.state.name === null) {
      connect.send("VKWebAppGetUserInfo");
    }
    if (this.state.access_token === null) {
      connect.send("VKWebAppGetAuthToken", {
        app_id: 6603324,
        scope: "friends"
      });
    }
    /*if (this.state.post === null) {
      connect.send("VKWebAppShowWallPostBoxResult");
    }*/
  }

  render() {
    return (
      <UI.Root activeView={this.state.activeView}>
        <UI.View activePanel="panel1.1" id="view1">
          <UI.Panel id="panel1.1">
            <UI.PanelHeader>Очень тестовый сервис</UI.PanelHeader>
            <UI.Group title="Кнопки">
              <UI.Div>{this.state.access_token}</UI.Div>
              <UI.Div style={{ display: "flex" }}>
                <UI.Button
                  size="m"
                  onClick={() =>
                    connect.send("VKWebAppSendPayload", {
                      group_id: 133183695,
                      payload: { foo: "bar" }
                    })
                  }
                  stretched
                  style={{ marginRight: 8 }}
                >
                  Синяя
                </UI.Button>
                <UI.Button
                  size="m"
                  onClick={() => {
                    this.share();
                  }}
                  stretched
                  level="2"
                >
                  Серая
                </UI.Button>
              </UI.Div>
            </UI.Group>
          </UI.Panel>
        </UI.View>
        <UI.View header activePanel="panel2.1" id="view2">
          <UI.Panel id="panel2.1">
            <UI.PanelHeader>Обо мне</UI.PanelHeader>
            <UI.Group title="Информация">
              <UI.List>
                <UI.ListItem>{this.state.name}</UI.ListItem>
                <UI.ListItem>Город: {this.state.city}</UI.ListItem>
                <UI.ListItem>
                  Друзей всего: {this.state.access_token}
                </UI.ListItem>
              </UI.List>
            </UI.Group>
            <UI.Group>
              <UI.Button
                type="cell"
                onClick={() => this.setState({ activeView: "view1" })}
              >
                Назад
              </UI.Button>
            </UI.Group>
          </UI.Panel>
        </UI.View>
        <UI.View header activePanel="panel3.1" id="view3">
          <UI.Panel id="panel3.1">
            <UI.PanelHeader>Запись на стене</UI.PanelHeader>
            <UI.Group title="Ссылка на запись">
              <UI.List>
                <UI.ListItem>
                  <a href={this.state.post}>{this.state.post}</a>
                </UI.ListItem>
              </UI.List>
            </UI.Group>
            <UI.Group>
              <UI.Button
                type="cell"
                onClick={() => this.setState({ activeView: "view1" })}
              >
                Назад
              </UI.Button>
            </UI.Group>
          </UI.Panel>
        </UI.View>
      </UI.Root>
    );
  }
  share() {
    connect.send("VKWebAppShowCommunityWidgetPreviewBox", {
      group_id: 500,
      type: "text",
      code: 'return {"title": "Цитата", "text": "Текст цитаты"};'
    });
    /* console.log(this.state.access_token);
    connect.send("VKWebAppCallAPIMethod", {
      method: "friends.get",
      params: { v: "5.80", access_token: this.state.access_token }
    });
   connect.send("VKWebAppShowWallPostBox", {
      message: this.state.name
    });
    let posts = this;
    connect.subscribe(e => {
      e = e.detail;
      if (e["type"] === "VKWebAppShowWallPostBoxResult") {
        let post =
          "vk.com/wall" + this.state.user_id + "_" + e["data"]["post_id"];
        posts.setState({ post: post });
        posts.setState({ activeView: "view3" });
      } else if (e["type"] === "VKWebAppShowWallPostBoxFailed") {
        let error = e["data"]["error_type"];
        posts.setState({ post: error });
        posts.setState({ activeView: "view3" });
      }
    });*/
  }
}

export default App;

// SiYuan - Refactor your thinking
// Copyright (c) 2020-present, b3log.org
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

//go:build !mobile

package main

import (
	"flag"

	"github.com/siyuan-note/siyuan/kernel/cache"
	"github.com/siyuan-note/siyuan/kernel/job"
	"github.com/siyuan-note/siyuan/kernel/model"
	"github.com/siyuan-note/siyuan/kernel/server"
	"github.com/siyuan-note/siyuan/kernel/sql"
	"github.com/siyuan-note/siyuan/kernel/util"
)

func main() {
	// Parse command line arguments
	workspace := flag.String("workspace", "", "workspace path")
	accessAuthCode := flag.String("accessAuthCode", "", "access auth code")
	serverMode := flag.Bool("serverMode", false, "run in server mode")
	serverHost := flag.String("serverHost", "0.0.0.0", "server host")
	serverPort := flag.String("serverPort", "6806", "server port")
	jwtSecret := flag.String("jwtSecret", "", "JWT secret key")
	corsOrigins := flag.String("corsOrigins", "*", "allowed CORS origins")
	flag.Parse()

	// Initialize system
	util.Boot()

	// Set configuration from command line arguments
	model.InitConf()
	if *workspace != "" {
		model.Conf.System.WorkspaceDir = *workspace
	}
	if *accessAuthCode != "" {
		model.Conf.System.AccessAuthCode = *accessAuthCode
	}
	model.Conf.System.ServerMode = *serverMode
	model.Conf.System.ServerHost = *serverHost
	model.Conf.System.ServerPort = *serverPort
	model.Conf.System.JWTSecret = *jwtSecret
	model.Conf.System.CORSOrigins = []string{*corsOrigins}

	// Start server
	go server.Serve(false)

	// Initialize other components
	model.InitAppearance()
	sql.InitDatabase(false)
	sql.InitHistoryDatabase(false)
	sql.InitAssetContentDatabase(false)
	sql.SetCaseSensitive(model.Conf.Search.CaseSensitive)
	sql.SetIndexAssetPath(model.Conf.Search.IndexAssetPath)

	model.BootSyncData()
	model.InitBoxes()
	model.LoadFlashcards()
	util.LoadAssetsTexts()

	util.SetBooted()
	util.PushClearAllMsg()

	job.StartCron()

	go util.LoadSysFonts()
	go model.AutoGenerateFileHistory()
	go cache.LoadAssets()
	go util.CheckFileSysStatus()

	model.WatchAssets()
	model.WatchEmojis()
	model.HandleSignal()
}

  "use client";
  
  import React, { useState, useEffect } from 'react';
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Card } from "@/components/ui/card";
  import { Gift, UserPlus, Trophy, Users, RotateCcw } from "lucide-react";
  
  export default function LuckyDraw() {
    const nameMapping = {
      "蕭咏瑜": "龍蝦",
      "黃安琪": "研發隱藏歌神",
      "魏豪毅": "傷很深的男人",
      "陳冠穎": "永遠的牛馬",
      "林維信": "聽團仔的神",
      "張豐毅": "東北的牛馬",
      "羅文婕": "研發仙子",
      "徐菀翎": "蹲著飆高音",
      "張家維": "研發內建GPT",
      "徐筱婷": "兵馬俑將領",
      "何明展": "搖滾展哥",
      "周庭儀": "靜音模式的妹子"
    };
  
    const initialParticipants = Object.keys(nameMapping);
    const prizesConfig = [  
      { name: "百萬富翁機會", startOrder: 1, count: 7 },  
      { name: "耳掛式咖啡", startOrder: 2, count: 1 },  
      { name: "行充寶貝", startOrder: 3, count: 2 },  
      { name: "肩頸按摩儀", startOrder: 4, count: 1 },  
      { name: "蘋果三合一充電線", startOrder: 5, count: 1 }  
    ]; 
        // 生成初始獎品陣列  
    const generateInitialPrizes = () => {  
      const prizes = [];  
      prizesConfig.forEach(config => {  
        for (let i = 0; i < config.count; i++) {  
          prizes.push({  
            name: config.name,  
            order: config.startOrder  
          });  
        }  
      });  
      // 按 order 排序  
      return prizes.sort((a, b) => a.order - b.order);  
    };  

    const initialPrizes = generateInitialPrizes();
  
    const [participants, setParticipants] = useState(initialParticipants);
    const [prizes, setPrizes] = useState(initialPrizes);
    const [newParticipant, setNewParticipant] = useState('');
    const [newPrize, setNewPrize] = useState('');
    const [results, setResults] = useState([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const [remainingParticipants, setRemainingParticipants] = useState(initialParticipants);
    const [remainingPrizes, setRemainingPrizes] = useState(initialPrizes);
    const [currentDrawing, setCurrentDrawing] = useState({ names: [], prize: '' });
    const [showWinnerAnimation, setShowWinnerAnimation] = useState(false);
    const [latestWinner, setLatestWinner] = useState(null);
    const [currentOrder, setCurrentOrder] = useState(1);
  
    const getNickname = (realName) => nameMapping[realName] || realName;
  
    useEffect(() => {
      setRemainingParticipants([...participants]);
    }, [participants]);
  
    useEffect(() => {
      setRemainingPrizes([...prizes]);
    }, [prizes]);
  
    const addParticipant = (e) => {
      e.preventDefault();
      if (newParticipant.trim()) {
        setParticipants([...participants, newParticipant.trim()]);
        setRemainingParticipants([...remainingParticipants, newParticipant.trim()]);
        setNewParticipant('');
      }
    };
  
    const addPrize = (e) => {
      e.preventDefault();
      if (newPrize.trim()) {
        setPrizes([...prizes, newPrize.trim()]);
        setRemainingPrizes([...remainingPrizes, newPrize.trim()]);
        setNewPrize('');
      }
    };
  
    // 修改 drawPrize 函數  
    const drawPrize = () => {  
      if (remainingParticipants.length === 0 || (remainingPrizes.length === 0 && !remainingParticipants.includes("何明展"))) {  
        alert('抽獎已結束或沒有足夠的參與者/獎品！');  
        return;  
      }  

      setIsDrawing(true);  

      const animationDuration = 2000;  
      const intervalTime = 50;  
      let elapsed = 0;  

      // 篩選當前順序的獎品  
      const availablePrizes = remainingPrizes.filter(prize => prize.order === currentOrder);  
      
      const animationInterval = setInterval(() => {  
        const randomNames = Array(3).fill().map(() =>   
          getNickname(remainingParticipants[Math.floor(Math.random() * remainingParticipants.length)])  
        );  
        const randomPrize = availablePrizes[Math.floor(Math.random() * availablePrizes.length)];  
        
        setCurrentDrawing({  
          names: randomNames,  
          prize: randomPrize.name  
        });  

        elapsed += intervalTime;  
        
        if (elapsed >= animationDuration) {  
          clearInterval(animationInterval);  
          finalizeDrawing(availablePrizes);  
        }  
      }, intervalTime);  
    };  

    const finalizeDrawing = (availablePrizes) => {  
      const winnerIndex = Math.floor(Math.random() * remainingParticipants.length);  
      const prizeIndex = Math.floor(Math.random() * availablePrizes.length);  
    
      const winner = remainingParticipants[winnerIndex];  
      let prize = availablePrizes[prizeIndex];  
    
      if (winner === "何明展") {  
        prize = { name: "恭賀協理加碼___(看你的心意了啾咪)", order: 999 };  
      }  
    
      const winnerNickname = getNickname(winner);  
    
      setLatestWinner({ name: winnerNickname, prize: prize.name });  
      setShowWinnerAnimation(true);  
    
      setTimeout(() => {  
        setShowWinnerAnimation(false);  
    
        const newResult = {  
          winner: winnerNickname,  
          prize: prize.name,  
          timestamp: new Date().toLocaleTimeString(),  
          realName: winner,  
        };  
    
        setResults([newResult, ...results]);  
    
        // 正確更新剩餘參與者和獎品  
        const newRemainingParticipants = remainingParticipants.filter(  
          (p) => p !== winner  
        );  
        const newRemainingPrizes = remainingPrizes.filter(  
          (p, index) => !(p.order === prize.order && p.name === prize.name && index === remainingPrizes.indexOf(prize))  
        );  
    
        setRemainingParticipants(newRemainingParticipants);  
        setRemainingPrizes(newRemainingPrizes);  
    
        // 檢查是否需要進入下一個順序  
        const currentOrderPrizes = newRemainingPrizes.filter(  
          (p) => p.order === currentOrder  
        );  
        if (currentOrderPrizes.length === 0) {  
          setCurrentOrder((prev) => prev + 1);  
        }  
    
        setIsDrawing(false);  
        setCurrentDrawing({ names: [], prize: "" });  
      }, 3000);  
    };  

    const getPrizeCounts = () => {  
      const counts = {};  
    
      remainingPrizes.forEach((prize) => {  
        const key = `${prize.name}-${prize.order}`;  
        if (!counts[key]) {  
          counts[key] = { name: prize.name, count: 0, order: prize.order };  
        }  
        counts[key].count++;  
      });  
    
      return Object.values(counts).sort((a, b) => a.order - b.order);  
    };  
  
    const resetDrawing = () => {
      if (window.confirm('確定要重新開始抽獎嗎？這將清空所有抽獎結果。')) {
        setParticipants(initialParticipants);
        setPrizes(initialPrizes);
        setRemainingParticipants(initialParticipants);
        setRemainingPrizes(initialPrizes);
        setResults([]);
        setIsDrawing(false);
        setCurrentDrawing({ names: [], prize: '' });
        setNewParticipant('');
        setNewPrize('');
        setShowWinnerAnimation(false);
        setLatestWinner(null);
      }
    };
  
    return (
      <div className="container mx-auto p-4 max-w-4xl bg-white">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">幸運抽獎器</h1>
          <Button 
            onClick={resetDrawing}
            className="flex items-center gap-2"
            variant="outline"
          >
            <RotateCcw className="h-4 w-4" />
            重新開始
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Users className="mr-2" />
              參與者列表
            </h2>
            <div className="mt-2">
              <h3 className="font-medium mb-2 flex items-center">
                <Users className="mr-2 h-4 w-4" />
                剩餘參與者 ({remainingParticipants.length})：
              </h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {remainingParticipants.map((participant, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 rounded-full text-sm">
                    {getNickname(participant)}
                  </span>
                ))}
              </div>
              
              <form onSubmit={addParticipant} className="mt-4 space-y-2">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="輸入新參與者姓名"
                    value={newParticipant}
                    onChange={(e) => setNewParticipant(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" className="flex items-center gap-1">
                    <UserPlus className="h-4 w-4" />
                    新增
                  </Button>
                </div>
              </form>
            </div>
          </Card>
  
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Gift className="mr-2" />
              獎品列表
            </h2>
            <div className="mt-2">
              <h3 className="font-medium mb-2 flex items-center">
                <Gift className="mr-2 h-4 w-4" />
                剩餘獎品：
              </h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {getPrizeCounts().map((prize, index) => (
                  <span key={index} className={`px-3 py-1 rounded-full text-sm ${  
                    prize.order === currentOrder ? 'bg-green-200 font-bold' : 'bg-green-100'  
                  }`}>  
                    {prize.name} × {prize.count}  
                  </span>
                ))}
              </div>
  
              <form onSubmit={addPrize} className="mt-4 space-y-2">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="輸入新獎品名稱"
                    value={newPrize}
                    onChange={(e) => setNewPrize(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" className="flex items-center gap-1">
                    <Gift className="h-4 w-4" />
                    新增
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
  
        {isDrawing && (
          <Card className="my-6 p-6 text-center bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="text-2xl font-bold mb-4 animate-bounce">
              抽獎中...
            </div>
            <div className="space-y-2">
              {currentDrawing.names.map((name, index) => (
                <div key={index} className="text-xl font-semibold text-purple-600">
                  {name}
                </div>
              ))}
              {currentDrawing.prize && (
                <div className="text-xl font-semibold text-green-600 mt-2">
                  {currentDrawing.prize}
                </div>
              )}
            </div>
          </Card>
        )}
  
        {showWinnerAnimation && latestWinner && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="animate-winner text-center p-8 rounded-lg bg-white shadow-lg transform scale-150 transition-transform duration-500">
              <div className="text-4xl font-bold text-purple-600 mb-4 animate-bounce">
                🎉 恭喜 🎉
              </div>
              <div className="text-5xl font-bold text-purple-800 mb-6 animate-pulse">
                {latestWinner.name}
              </div>
              <div className="text-2xl text-green-600">
                獲得 {latestWinner.prize}
              </div>
            </div>
          </div>
        )}
  
        <div className="text-center my-8">
          <Button 
            onClick={drawPrize} 
            disabled={isDrawing || remainingParticipants.length === 0 || (remainingPrizes.length === 0 && !remainingParticipants.includes("何明展"))}
            className="px-8 py-4 text-lg"
          >
            {isDrawing ? '抽獎中...' : '抽取下一個獎品'}
          </Button>
        </div>
  
        {results.length > 0 && (
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Trophy className="mr-2" />
              抽獎結果
            </h2>
            <div className="space-y-2">
              {results.map((result, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-lg grid grid-cols-[auto_1fr_auto_1fr] items-center gap-4
                    ${index === 0 ? 'bg-yellow-100 shadow-md' : 'bg-yellow-50'}`}
                >
                  <span className="text-sm text-gray-500 whitespace-nowrap">
                    {result.timestamp}
                  </span>
                  <span className={`font-medium text-right
                    ${index === 0 ? 'text-lg text-purple-600' : ''}`}>
                    {result.winner}
                  </span>
                  <span className="text-gray-600 whitespace-nowrap justify-self-center">
                    獲得
                  </span>
                  <span className={`font-medium
                    ${index === 0 ? 'text-lg text-green-600' : 'text-green-600'}`}>
                    {result.prize}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    );
  }
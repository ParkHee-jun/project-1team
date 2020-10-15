function comma(str) {
    str = String(str);
    return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
  }
  
  function setUpbitData(){
  $.ajax({
    url: "https://api.upbit.com/v1/market/all",
    dataType: "json"
  }).done(function(markets){
    //$("#tmp").html( JSON.stringify(markets) );
    var arr_krw_markets = "";
    var arr_english_name = [];
    
    for(var i = 0; i < markets.length; i++){
      if( markets[i].market.indexOf("KRW-BTC") > -1 ){
        arr_krw_markets += markets[i].market+(",");
        arr_english_name.push(markets[i].english_name.replace("",""));      
      }
      if( markets[i].market.indexOf("KRW-ETH") > -1 ){
        arr_krw_markets += markets[i].market+(",");
        arr_english_name.push(markets[i].english_name.replace("",""));      
      }
      if( markets[i].market.indexOf("KRW-EOS") > -1 ){
        arr_krw_markets += markets[i].market+(",");
        arr_english_name.push(markets[i].english_name.replace("",""));      
      }
      if( markets[i].market.indexOf("KRW-XRP") > -1 ){
        arr_krw_markets += markets[i].market+(",");
        arr_english_name.push(markets[i].english_name.replace("",""));      
      }
    }
    arr_krw_markets = arr_krw_markets.substring(0, arr_krw_markets.length-1);
    //$("#tmp").html( arr_krw_markets );
    $.ajax({
      url: "https://api.upbit.com/v1/ticker?markets=" + arr_krw_markets,
      dataType: "json"
    }).done(function(tickers){
      $("#table_ticker > tbody > tr").remove();
      //alert($("#table_ticker > tbody > tr").length);
     
  
      for(var i = 0;i < tickers.length;i++){
        var rowHtml = "<tr><td>"+arr_english_name[i] +"</td>";
        //rowHtml += "<td>" + arr_korean_name[i] +"</td>"
        rowHtml += "<td>" + comma(tickers[i].trade_price)+" KRW</td>"
        rowHtml += "<td>" + ((tickers[i].signed_change_rate*100).toFixed(2))+"%</td>"
        rowHtml += "<td>" + comma(tickers[i].high_price) + " KRW</td>"
        rowHtml += "<td>" + comma(tickers[i].low_price) + " KRW</td>"
        rowHtml += "<td>" + comma((tickers[i].acc_trade_price_24h>1000000 ? ( tickers[i].acc_trade_price_24h / 1000000 ) : tickers[i].acc_trade_price_24h ).toFixed(0)) + (tickers[i].acc_trade_price_24h>1000000 ? "백만" : "") + "</td>"
        rowHtml += "</tr>";
        $("#table_ticker > tbody:last").append(rowHtml);
        //markets[i].korean_name
      } // end for...
      
    })  //done(function(tickers){
  }) // end done(function(markets){
  .fail(function(){
    //alert("업비트 API 접근 중 에러.")}
    $("#tmp").text( "API 접근 중 에러." );
  })
  setTimeout(setUpbitData, 13000);
  }
  $(function() {
  var color = localStorage.getItem("test_upbit_color");
  if( color ) $("#wrapper").css("color", color);
  setUpbitData();
  });
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from 'recharts'

// Merge MAP and Lambda histories by index position (both sampled at same rate)
function mergeHistory(mapHistory, lambdaHistory) {
  const len = Math.max(mapHistory.length, lambdaHistory.length)
  return Array.from({ length: len }, (_, i) => ({
    i,
    map: mapHistory[i]?.value ?? null,
    lambda: lambdaHistory[i]?.value ?? null,
  }))
}

export function HistoryChart({ history }) {
  const data = mergeHistory(history['0x0B'], history['0x24'])

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-600 text-sm">
        Aguardando dados...
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="i" hide />
        <YAxis yAxisId="map" domain={[0, 255]} tick={{ fill: '#6b7280', fontSize: 11 }} width={36} />
        <YAxis yAxisId="lambda" orientation="right" domain={[10, 20]} tick={{ fill: '#6b7280', fontSize: 11 }} width={36} />
        <Tooltip
          contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8 }}
          labelStyle={{ display: 'none' }}
          itemStyle={{ color: '#d1d5db', fontSize: 12 }}
        />
        <Legend wrapperStyle={{ color: '#9ca3af', fontSize: 12 }} />
        <Line
          yAxisId="map"
          type="monotone"
          dataKey="map"
          name="MAP (kPa)"
          stroke="#34d399"
          dot={false}
          strokeWidth={2}
          isAnimationActive={false}
        />
        <Line
          yAxisId="lambda"
          type="monotone"
          dataKey="lambda"
          name="Lambda A/F"
          stroke="#818cf8"
          dot={false}
          strokeWidth={2}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

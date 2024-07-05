library ieee;
use ieee.STD_LOGIC_1164.all;


entity Mux_4_16bit is 
	generic (au_bw : integer := 16);
	port (
		input_0 ,input_1 ,input_2 ,input_3 : in std_logic_vector(au_bw - 1 downto 0) := (others => '0');
		sel : in std_logic_vector(1 downto 0) := (others => '0');
		output : out std_logic_vector(au_bw - 1 downto 0) := (others => '0')
	);
end Mux_4_16bit;


architecture Behavioral of Mux_4_16bit is

begin
	process(input_0 ,input_1 ,input_2 ,input_3,sel)

	begin
			case sel is
				when "00" => output <= input_0;
				when "01" => output <= input_1;
				when "10" => output <= input_2;
				when "11" => output <= input_3;
				when others => output <= (others => '0');
			end case;		
	end process;


end Behavioral;
